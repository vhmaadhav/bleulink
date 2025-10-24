import AlertPanel, { Alert } from "../AlertPanel";
import { useState } from "react";

export default function AlertPanelExample() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      machineId: "CNC-003",
      type: "critical",
      message: "Coolant level critically low. Immediate refill required.",
      timestamp: "2 minutes ago",
    },
    {
      id: "2",
      machineId: "CNC-002",
      type: "warning",
      message: "Mix ratio deviation detected. Current ratio 1:11.5 (expected 1:10).",
      timestamp: "15 minutes ago",
    },
    {
      id: "3",
      machineId: "CNC-001",
      type: "info",
      message: "Scheduled maintenance reminder for next week.",
      timestamp: "1 hour ago",
    },
    {
      id: "4",
      machineId: "CNC-004",
      type: "warning",
      message: "Predicted to run out of coolant in 6 hours.",
      timestamp: "2 hours ago",
    },
  ]);

  const handleDismiss = (id: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== id));
    console.log(`Dismissed alert ${id}`);
  };

  const handleMarkAllRead = () => {
    setAlerts([]);
    console.log("All alerts marked as read");
  };

  return (
    <div className="p-6 max-w-md">
      <AlertPanel
        alerts={alerts}
        onDismiss={handleDismiss}
        onMarkAllRead={handleMarkAllRead}
      />
    </div>
  );
}
