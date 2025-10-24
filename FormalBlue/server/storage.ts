import {
  type User,
  type InsertUser,
  type Machine,
  type InsertMachine,
  type Reading,
  type InsertReading,
  type Alert,
  type InsertAlert,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Machine operations
  getMachine(id: string): Promise<Machine | undefined>;
  getMachineByMachineId(machineId: string): Promise<Machine | undefined>;
  getAllMachines(): Promise<Machine[]>;
  createMachine(machine: InsertMachine): Promise<Machine>;
  updateMachineStatus(
    machineId: string,
    status: "normal" | "warning" | "critical" | "offline"
  ): Promise<void>;
  updateMachinePrediction(
    machineId: string,
    predictedDepletionTime: Date | null
  ): Promise<void>;

  // Reading operations
  createReading(reading: InsertReading): Promise<Reading>;
  getReadingsByMachine(machineId: string, limit?: number): Promise<Reading[]>;
  getAllReadings(limit?: number): Promise<Reading[]>;
  getRecentReadingsByMachine(machineId: string, hours: number): Promise<Reading[]>;
  updateReadingAnalytics(
    id: string,
    mixRatio: number,
    isAnomaly: number
  ): Promise<void>;

  // Alert operations
  createAlert(alert: InsertAlert): Promise<Alert>;
  getAlerts(limit?: number): Promise<Alert[]>;
  getUnreadAlerts(): Promise<Alert[]>;
  markAlertAsRead(id: string): Promise<void>;
  markAllAlertsAsRead(): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private machines: Map<string, Machine>;
  private readings: Reading[];
  private alerts: Map<string, Alert>;

  constructor() {
    this.users = new Map();
    this.machines = new Map();
    this.readings = [];
    this.alerts = new Map();
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      role: insertUser.role || "OPERATOR",
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  // Machine operations
  async getMachine(id: string): Promise<Machine | undefined> {
    return this.machines.get(id);
  }

  async getMachineByMachineId(machineId: string): Promise<Machine | undefined> {
    return Array.from(this.machines.values()).find(
      (machine) => machine.machineId === machineId
    );
  }

  async getAllMachines(): Promise<Machine[]> {
    return Array.from(this.machines.values());
  }

  async createMachine(insertMachine: InsertMachine): Promise<Machine> {
    const id = randomUUID();
    const machine: Machine = {
      ...insertMachine,
      id,
      name: insertMachine.name || null,
      location: insertMachine.location || null,
      status: insertMachine.status || "normal",
      standardMixRatio: insertMachine.standardMixRatio || 10.0,
      predictedDepletionTime: null,
      lastReadingAt: null,
      createdAt: new Date(),
    };
    this.machines.set(id, machine);
    return machine;
  }

  async updateMachineStatus(
    machineId: string,
    status: "normal" | "warning" | "critical" | "offline"
  ): Promise<void> {
    const machine = await this.getMachineByMachineId(machineId);
    if (machine) {
      machine.status = status;
    }
  }

  async updateMachinePrediction(
    machineId: string,
    predictedDepletionTime: Date | null
  ): Promise<void> {
    const machine = await this.getMachineByMachineId(machineId);
    if (machine) {
      machine.predictedDepletionTime = predictedDepletionTime;
    }
  }

  // Reading operations
  async createReading(insertReading: InsertReading): Promise<Reading> {
    // Validate machine exists
    const machine = await this.getMachineByMachineId(insertReading.machineId);
    if (!machine) {
      throw new Error(`Machine ${insertReading.machineId} not found`);
    }

    const id = randomUUID();
    const reading: Reading = {
      ...insertReading,
      id,
      timestamp: new Date(),
      mixRatio: insertReading.mixRatio ?? null,
      isAnomaly: insertReading.isAnomaly ?? 0,
    };
    this.readings.push(reading);

    // Update machine's lastReadingAt
    machine.lastReadingAt = reading.timestamp;

    return reading;
  }

  async getReadingsByMachine(
    machineId: string,
    limit: number = 100
  ): Promise<Reading[]> {
    return this.readings
      .filter((r) => r.machineId === machineId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async getAllReadings(limit: number = 100): Promise<Reading[]> {
    return this.readings
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async getRecentReadingsByMachine(
    machineId: string,
    hours: number
  ): Promise<Reading[]> {
    const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);
    return this.readings
      .filter(
        (r) => r.machineId === machineId && r.timestamp >= cutoffTime
      )
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async updateReadingAnalytics(
    id: string,
    mixRatio: number,
    isAnomaly: number
  ): Promise<void> {
    const reading = this.readings.find((r) => r.id === id);
    if (reading) {
      reading.mixRatio = mixRatio;
      reading.isAnomaly = isAnomaly;
    }
  }

  // Alert operations
  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    // Validate machine exists
    const machine = await this.getMachineByMachineId(insertAlert.machineId);
    if (!machine) {
      throw new Error(`Machine ${insertAlert.machineId} not found`);
    }

    const id = randomUUID();
    const alert: Alert = {
      ...insertAlert,
      id,
      isRead: 0,
      createdAt: new Date(),
    };
    this.alerts.set(id, alert);
    return alert;
  }

  async getAlerts(limit: number = 50): Promise<Alert[]> {
    return Array.from(this.alerts.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async getUnreadAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values())
      .filter((alert) => alert.isRead === 0)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async markAlertAsRead(id: string): Promise<void> {
    const alert = this.alerts.get(id);
    if (alert) {
      alert.isRead = 1;
    }
  }

  async markAllAlertsAsRead(): Promise<void> {
    Array.from(this.alerts.values()).forEach((alert) => {
      alert.isRead = 1;
    });
  }
}

export const storage = new MemStorage();
