import { type Reading, type InsertAlert } from "@shared/schema";
import { storage } from "./storage";

/**
 * Calculate mix ratio from raw and mixed coolant levels
 * In this implementation, we track the ratio of mixed to raw coolant levels
 * A ratio of 1.0 means levels are balanced (standard for our system)
 */
export function calculateMixRatio(
  rawCoolantLevel: number,
  mixedCoolantLevel: number
): number {
  if (rawCoolantLevel === 0) return 0;
  return mixedCoolantLevel / rawCoolantLevel;
}

/**
 * Check if mix ratio deviates from standard (±15% tolerance)
 * Standard ratio of 1.0 means mixed and raw levels should be approximately equal
 */
export function checkMixRatioDeviation(
  actualRatio: number,
  standardRatio: number = 1.0
): boolean {
  const tolerance = 0.15; // 15% tolerance
  const lowerBound = standardRatio * (1 - tolerance);
  const upperBound = standardRatio * (1 + tolerance);
  return actualRatio < lowerBound || actualRatio > upperBound;
}

/**
 * Detect anomalies using 3 standard deviations rule
 */
export async function detectFlowRateAnomaly(
  machineId: string,
  currentFlowRate: number
): Promise<boolean> {
  // Get last 24 hours of readings
  const readings = await storage.getRecentReadingsByMachine(machineId, 24);

  if (readings.length < 10) {
    // Not enough data to detect anomalies
    return false;
  }

  // Calculate mean and standard deviation
  const flowRates = readings.map((r) => r.flowRate);
  const mean = flowRates.reduce((sum, val) => sum + val, 0) / flowRates.length;

  const variance =
    flowRates.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
    flowRates.length;
  const stdDev = Math.sqrt(variance);

  // Check if current flow rate is more than 3 standard deviations from mean
  const deviations = Math.abs(currentFlowRate - mean) / stdDev;
  return deviations > 3;
}

/**
 * Predict when coolant will run out using linear regression on last 10 readings
 */
export async function predictDepletionTime(
  machineId: string
): Promise<Date | null> {
  const readings = await storage.getRecentReadingsByMachine(machineId, 24);

  if (readings.length < 10) {
    return null;
  }

  // Use last 10 readings for prediction
  const recentReadings = readings.slice(0, 10).reverse(); // Oldest to newest

  // Calculate rate of decrease using linear regression
  const n = recentReadings.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;

  recentReadings.forEach((reading, index) => {
    const x = index; // Time index
    const y = reading.mixedCoolantLevel; // Level
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
  });

  // Calculate slope (rate of change)
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

  if (slope >= 0) {
    // Level is not decreasing
    return null;
  }

  // Get current level and calculate time to depletion
  const currentLevel = recentReadings[n - 1].mixedCoolantLevel;
  const hoursToDepletion = -currentLevel / slope;

  if (hoursToDepletion <= 0 || hoursToDepletion > 1000) {
    return null;
  }

  // Calculate depletion time
  const lastReadingTime = recentReadings[n - 1].timestamp;
  const depletionTime = new Date(
    lastReadingTime.getTime() + hoursToDepletion * 60 * 60 * 1000
  );

  return depletionTime;
}

/**
 * Determine machine status based on coolant levels
 */
export function determineMachineStatus(
  mixedCoolantLevel: number
): "normal" | "warning" | "critical" {
  if (mixedCoolantLevel < 20) return "critical";
  if (mixedCoolantLevel < 50) return "warning";
  return "normal";
}

/**
 * Process a new reading and generate alerts if necessary
 */
export async function processReading(
  machineId: string,
  reading: Reading
): Promise<void> {
  const machine = await storage.getMachineByMachineId(machineId);
  if (!machine) return;

  const alerts: InsertAlert[] = [];

  // Check mix ratio deviation
  if (reading.mixRatio) {
    const hasDeviation = checkMixRatioDeviation(
      reading.mixRatio,
      machine.standardMixRatio
    );
    if (hasDeviation) {
      alerts.push({
        machineId,
        type: "mix_ratio_deviation",
        severity: "warning",
        message: `Mix ratio deviation detected. Current ratio ${reading.mixRatio.toFixed(
          2
        )} (expected ~${machine.standardMixRatio.toFixed(2)} ±15%).`,
      });
    }
  }

  // Check anomaly
  if (reading.isAnomaly === 1) {
    alerts.push({
      machineId,
      type: "anomaly_detected",
      severity: "warning",
      message: `Unusual flow rate detected: ${reading.flowRate.toFixed(
        1
      )} L/h (significantly different from 24h average).`,
    });
  }

  // Check coolant levels
  const status = determineMachineStatus(reading.mixedCoolantLevel);
  await storage.updateMachineStatus(machineId, status);

  if (reading.mixedCoolantLevel < 20) {
    alerts.push({
      machineId,
      type: "low_coolant",
      severity: "critical",
      message: `Coolant level critically low at ${reading.mixedCoolantLevel.toFixed(
        1
      )}%. Immediate refill required.`,
    });
  } else if (reading.mixedCoolantLevel < 50) {
    alerts.push({
      machineId,
      type: "low_coolant",
      severity: "warning",
      message: `Coolant level is low at ${reading.mixedCoolantLevel.toFixed(
        1
      )}%. Consider refilling soon.`,
    });
  }

  // Check predicted depletion
  const depletionTime = await predictDepletionTime(machineId);
  if (depletionTime) {
    await storage.updateMachinePrediction(machineId, depletionTime);

    const hoursUntilDepletion =
      (depletionTime.getTime() - Date.now()) / (1000 * 60 * 60);
    if (hoursUntilDepletion < 12) {
      alerts.push({
        machineId,
        type: "predicted_depletion",
        severity: hoursUntilDepletion < 4 ? "critical" : "warning",
        message: `Predicted to run out of coolant in ${Math.round(
          hoursUntilDepletion
        )} hours at current usage rate.`,
      });
    }
  }

  // Create all alerts
  for (const alert of alerts) {
    await storage.createAlert(alert);
  }
}
