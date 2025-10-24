/**
 * Synthetic Data Generator - Simulates ESP32 Sensor Readings
 * 
 * This script generates realistic coolant sensor data for testing the BleuLink system.
 * In production, this data would come from actual ESP32 microcontrollers with
 * flow meters and level sensors.
 * 
 * Usage: npm run synthetic-data
 */

interface MachineState {
  machineId: string;
  rawCoolantLevel: number;
  mixedCoolantLevel: number;
  flowRate: number;
  usageRate: number; // How fast coolant is consumed
}

const API_URL = process.env.API_URL || "http://localhost:5000";

// Initialize machine states with realistic starting values
// Note: Mix ratio should be approximately 1.0 (mixed ≈ raw)
const machines: MachineState[] = [
  {
    machineId: "CNC-001",
    rawCoolantLevel: 88.0,
    mixedCoolantLevel: 92.0,
    flowRate: 5.1,
    usageRate: 0.8, // % per hour
  },
  {
    machineId: "CNC-002",
    rawCoolantLevel: 64.0,
    mixedCoolantLevel: 68.0,
    flowRate: 4.8,
    usageRate: 1.2, // % per hour
  },
  {
    machineId: "CNC-003",
    rawCoolantLevel: 48.0,
    mixedCoolantLevel: 52.0,
    flowRate: 6.2,
    usageRate: 1.5, // % per hour
  },
];

/**
 * Generate a realistic reading for a machine
 */
function generateReading(machine: MachineState): {
  machineId: string;
  rawCoolantLevel: number;
  mixedCoolantLevel: number;
  flowRate: number;
} {
  // Add some random noise to make data realistic
  const noise = () => (Math.random() - 0.5) * 2; // -1 to +1

  // Decrease coolant levels over time (both at similar rates to maintain ~1.0 ratio)
  const timeInterval = 10 / 3600; // 10 seconds in hours
  machine.mixedCoolantLevel -= machine.usageRate * timeInterval;
  machine.rawCoolantLevel -= machine.usageRate * 0.95 * timeInterval; // Slightly slower to maintain balance

  // Ensure levels don't go below 0
  machine.mixedCoolantLevel = Math.max(0, machine.mixedCoolantLevel);
  machine.rawCoolantLevel = Math.max(0, machine.rawCoolantLevel);

  // Vary flow rate slightly (±15%)
  machine.flowRate = machine.flowRate * (1 + noise() * 0.15);

  // Occasionally simulate anomalies (sudden flow rate spike)
  if (Math.random() < 0.02) {
    // 2% chance
    machine.flowRate = machine.flowRate * (2 + Math.random());
    console.log(`⚠️  Simulated anomaly on ${machine.machineId}`);
  }

  // Simulate refills when level gets very low
  if (machine.mixedCoolantLevel < 10) {
    console.log(`🔄 Simulating refill for ${machine.machineId}`);
    const baseLevel = 85 + Math.random() * 10;
    machine.mixedCoolantLevel = baseLevel;
    machine.rawCoolantLevel = baseLevel * (0.95 + Math.random() * 0.1); // Keep ratio close to 1.0
  }

  return {
    machineId: machine.machineId,
    rawCoolantLevel: parseFloat(machine.rawCoolantLevel.toFixed(1)),
    mixedCoolantLevel: parseFloat(machine.mixedCoolantLevel.toFixed(1)),
    flowRate: parseFloat(machine.flowRate.toFixed(1)),
  };
}

/**
 * Send a reading to the backend API
 */
async function sendReading(reading: {
  machineId: string;
  rawCoolantLevel: number;
  mixedCoolantLevel: number;
  flowRate: number;
}): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/api/data/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reading),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`❌ Error sending data for ${reading.machineId}:`, error);
      return;
    }

    const data = await response.json();
    console.log(
      `✓ ${reading.machineId}: Mixed=${reading.mixedCoolantLevel.toFixed(
        1
      )}%, Raw=${reading.rawCoolantLevel.toFixed(
        1
      )}%, Flow=${reading.flowRate.toFixed(1)}L/h ${
        data.reading.isAnomaly ? "⚠️ ANOMALY" : ""
      }`
    );
  } catch (error) {
    console.error(`❌ Network error for ${reading.machineId}:`, error);
  }
}

/**
 * Main generator loop
 */
async function runGenerator(): Promise<void> {
  console.log("🚀 Starting Synthetic Data Generator");
  console.log(`📡 Sending data to: ${API_URL}/api/data/submit`);
  console.log(`🤖 Simulating ${machines.length} machines`);
  console.log("📊 Generating data every 10 seconds...\n");

  // Generate data every 10 seconds
  setInterval(async () => {
    for (const machine of machines) {
      const reading = generateReading(machine);
      await sendReading(reading);
    }
    console.log(""); // Empty line for readability
  }, 10000); // 10 seconds

  // Keep the script running
  process.on("SIGINT", () => {
    console.log("\n\n👋 Stopping data generator...");
    process.exit(0);
  });
}

// Run the generator
runGenerator().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
