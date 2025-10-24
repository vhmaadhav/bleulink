import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, real, integer, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User roles enum
export const userRoleEnum = pgEnum("user_role", ["OPERATOR", "SUPERVISOR", "MANAGER"]);

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: userRoleEnum("role").notNull().default("OPERATOR"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Machine status enum
export const machineStatusEnum = pgEnum("machine_status", ["normal", "warning", "critical", "offline"]);

// Machines table
export const machines = pgTable("machines", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  machineId: text("machine_id").notNull().unique(),
  name: text("name"),
  location: text("location"),
  standardMixRatio: real("standard_mix_ratio").notNull().default(10.0),
  status: machineStatusEnum("status").notNull().default("normal"),
  predictedDepletionTime: timestamp("predicted_depletion_time"),
  lastReadingAt: timestamp("last_reading_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertMachineSchema = createInsertSchema(machines).omit({
  id: true,
  createdAt: true,
  lastReadingAt: true,
});

export type InsertMachine = z.infer<typeof insertMachineSchema>;
export type Machine = typeof machines.$inferSelect;

// Readings table - stores time-series sensor data
export const readings = pgTable("readings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  machineId: text("machine_id").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  rawCoolantLevel: real("raw_coolant_level").notNull(),
  mixedCoolantLevel: real("mixed_coolant_level").notNull(),
  flowRate: real("flow_rate").notNull(),
  mixRatio: real("mix_ratio"),
  isAnomaly: integer("is_anomaly").notNull().default(0),
});

export const insertReadingSchema = createInsertSchema(readings).omit({
  id: true,
  timestamp: true,
}).extend({
  mixRatio: z.number().optional(),
  isAnomaly: z.number().min(0).max(1).optional(),
});

export type InsertReading = z.infer<typeof insertReadingSchema>;
export type Reading = typeof readings.$inferSelect;

// Alert type and severity enums
export const alertTypeEnum = pgEnum("alert_type", [
  "low_coolant",
  "mix_ratio_deviation",
  "anomaly_detected",
  "predicted_depletion",
  "maintenance_reminder",
  "system_info"
]);

export const alertSeverityEnum = pgEnum("alert_severity", ["critical", "warning", "info"]);

// Alerts table
export const alerts = pgTable("alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  machineId: text("machine_id").notNull(),
  type: alertTypeEnum("type").notNull(),
  severity: alertSeverityEnum("severity").notNull(),
  message: text("message").notNull(),
  isRead: integer("is_read").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  createdAt: true,
  isRead: true,
});

export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Alert = typeof alerts.$inferSelect;
