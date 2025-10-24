import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertReadingSchema,
  insertMachineSchema,
  type InsertReading,
} from "@shared/schema";
import {
  calculateMixRatio,
  detectFlowRateAnomaly,
  processReading,
} from "./analytics";

export async function registerRoutes(app: Express): Promise<Server> {
  // Sensor data submission endpoint - ESP32 hardware will POST here
  app.post("/api/data/submit", async (req, res) => {
    try {
      const data = insertReadingSchema.parse(req.body);

      // Calculate mix ratio
      const mixRatio = calculateMixRatio(
        data.rawCoolantLevel,
        data.mixedCoolantLevel
      );

      // Detect anomalies
      const isAnomaly = await detectFlowRateAnomaly(
        data.machineId,
        data.flowRate
      );

      // Create reading with calculated analytics
      const reading = await storage.createReading({
        ...data,
        mixRatio,
        isAnomaly: isAnomaly ? 1 : 0,
      });

      // Process reading and generate alerts
      await processReading(data.machineId, reading);

      res.json({
        success: true,
        reading: {
          id: reading.id,
          timestamp: reading.timestamp,
          mixRatio,
          isAnomaly,
        },
      });
    } catch (error) {
      console.error("Error submitting sensor data:", error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : "Invalid data",
      });
    }
  });

  // Machine endpoints
  app.get("/api/machines", async (_req, res) => {
    try {
      const machines = await storage.getAllMachines();
      res.json(machines);
    } catch (error) {
      console.error("Error fetching machines:", error);
      res.status(500).json({ error: "Failed to fetch machines" });
    }
  });

  app.get("/api/machines/:machineId", async (req, res) => {
    try {
      const machine = await storage.getMachineByMachineId(
        req.params.machineId
      );
      if (!machine) {
        return res.status(404).json({ error: "Machine not found" });
      }
      res.json(machine);
    } catch (error) {
      console.error("Error fetching machine:", error);
      res.status(500).json({ error: "Failed to fetch machine" });
    }
  });

  app.post("/api/machines", async (req, res) => {
    try {
      const machineData = insertMachineSchema.parse(req.body);
      const machine = await storage.createMachine(machineData);
      res.json(machine);
    } catch (error) {
      console.error("Error creating machine:", error);
      res.status(400).json({
        error: error instanceof Error ? error.message : "Invalid machine data",
      });
    }
  });

  // Reading endpoints
  app.get("/api/readings", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const readings = await storage.getAllReadings(limit);
      res.json(readings);
    } catch (error) {
      console.error("Error fetching readings:", error);
      res.status(500).json({ error: "Failed to fetch readings" });
    }
  });

  app.get("/api/readings/:machineId", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const readings = await storage.getReadingsByMachine(
        req.params.machineId,
        limit
      );
      res.json(readings);
    } catch (error) {
      console.error("Error fetching readings:", error);
      res.status(500).json({ error: "Failed to fetch readings" });
    }
  });

  app.get("/api/readings/:machineId/recent", async (req, res) => {
    try {
      const hours = req.query.hours
        ? parseInt(req.query.hours as string)
        : 24;
      const readings = await storage.getRecentReadingsByMachine(
        req.params.machineId,
        hours
      );
      res.json(readings);
    } catch (error) {
      console.error("Error fetching recent readings:", error);
      res.status(500).json({ error: "Failed to fetch recent readings" });
    }
  });

  // Alert endpoints
  app.get("/api/alerts", async (req, res) => {
    try {
      const unreadOnly = req.query.unread === "true";
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;

      const alerts = unreadOnly
        ? await storage.getUnreadAlerts()
        : await storage.getAlerts(limit);

      res.json(alerts);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      res.status(500).json({ error: "Failed to fetch alerts" });
    }
  });

  app.post("/api/alerts/:id/dismiss", async (req, res) => {
    try {
      await storage.markAlertAsRead(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error dismissing alert:", error);
      res.status(500).json({ error: "Failed to dismiss alert" });
    }
  });

  app.post("/api/alerts/mark-all-read", async (_req, res) => {
    try {
      await storage.markAllAlertsAsRead();
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking alerts as read:", error);
      res.status(500).json({ error: "Failed to mark alerts as read" });
    }
  });

  // Summary/stats endpoint
  app.get("/api/stats/summary", async (_req, res) => {
    try {
      const machines = await storage.getAllMachines();
      const alerts = await storage.getUnreadAlerts();
      const recentReadings = await storage.getAllReadings(100);

      // Calculate today's usage (sum of flow rates from today)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayReadings = recentReadings.filter(
        (r) => r.timestamp >= today
      );
      const todayUsage = todayReadings.reduce(
        (sum, r) => sum + r.flowRate,
        0
      );

      // Count machines with low coolant
      const lowCoolantCount = machines.filter((m) => m.status !== "normal").length;

      res.json({
        totalMachines: machines.length,
        activeAlerts: alerts.length,
        todayUsage: Math.round(todayUsage),
        lowCoolantCount,
      });
    } catch (error) {
      console.error("Error fetching summary stats:", error);
      res.status(500).json({ error: "Failed to fetch summary stats" });
    }
  });

  // Export endpoint for CSV
  app.get("/api/export/readings", async (req, res) => {
    try {
      const machineId = req.query.machineId as string | undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 1000;

      const readings = machineId
        ? await storage.getReadingsByMachine(machineId, limit)
        : await storage.getAllReadings(limit);

      // Generate CSV
      const headers = [
        "Machine ID",
        "Timestamp",
        "Raw Level (%)",
        "Mixed Level (%)",
        "Flow Rate (L/h)",
        "Mix Ratio",
        "Anomaly",
      ];
      const rows = readings.map((r) => [
        r.machineId,
        r.timestamp.toISOString(),
        r.rawCoolantLevel.toFixed(2),
        r.mixedCoolantLevel.toFixed(2),
        r.flowRate.toFixed(2),
        r.mixRatio?.toFixed(2) || "N/A",
        r.isAnomaly ? "Yes" : "No",
      ]);

      const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=coolant-readings-${Date.now()}.csv`
      );
      res.send(csv);
    } catch (error) {
      console.error("Error exporting readings:", error);
      res.status(500).json({ error: "Failed to export readings" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
