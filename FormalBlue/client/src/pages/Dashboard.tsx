import { useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import SummaryCard from "@/components/SummaryCard";
import MachineCard from "@/components/MachineCard";
import AlertPanel, { Alert } from "@/components/AlertPanel";
import UsageChart, { ChartDataPoint } from "@/components/UsageChart";
import DataTable, { ReadingData } from "@/components/DataTable";
import FilterBar from "@/components/FilterBar";
import { Server, AlertTriangle, Activity, TrendingDown } from "lucide-react";

export default function Dashboard() {
  const [isDark, setIsDark] = useState(false);
  
  // TODO: Remove mock functionality - this will be replaced with real API calls
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
  ]);

  // TODO: Remove mock functionality - replace with real machine data
  const machines = [
    {
      machineId: "CNC-001",
      name: "High Precision Lathe",
      status: "normal" as const,
      mixedCoolantLevel: 85.2,
      rawCoolantLevel: 78.5,
      flowRate: 5.1,
      mixRatio: 10.2,
    },
    {
      machineId: "CNC-002",
      name: "Vertical Mill",
      status: "warning" as const,
      mixedCoolantLevel: 32.5,
      rawCoolantLevel: 62.0,
      flowRate: 4.8,
      mixRatio: 9.8,
      timeToRefill: "6h",
    },
    {
      machineId: "CNC-003",
      name: "Grinding Machine",
      status: "critical" as const,
      mixedCoolantLevel: 15.8,
      rawCoolantLevel: 45.3,
      flowRate: 6.2,
      mixRatio: 11.5,
      timeToRefill: "2h",
    },
  ];

  // TODO: Remove mock functionality - replace with real chart data from API
  const chartData: ChartDataPoint[] = [
    { time: "00:00", mixedCoolant: 95, rawCoolant: 88 },
    { time: "04:00", mixedCoolant: 92, rawCoolant: 85 },
    { time: "08:00", mixedCoolant: 87, rawCoolant: 82 },
    { time: "12:00", mixedCoolant: 78, rawCoolant: 75 },
    { time: "16:00", mixedCoolant: 65, rawCoolant: 68 },
    { time: "20:00", mixedCoolant: 52, rawCoolant: 62 },
    { time: "24:00", mixedCoolant: 45, rawCoolant: 58 },
  ];

  // TODO: Remove mock functionality - replace with real readings data
  const readings: ReadingData[] = Array.from({ length: 25 }, (_, i) => ({
    id: `reading-${i}`,
    machineId: `CNC-00${(i % 3) + 1}`,
    timestamp: new Date(Date.now() - i * 3600000).toLocaleString(),
    rawLevel: 90 - i * 2,
    mixedLevel: 85 - i * 2.5,
    flowRate: 5 + Math.random() * 2,
    mixRatio: 9.5 + Math.random(),
  }));

  const handleThemeToggle = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const handleDismissAlert = (id: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== id));
    console.log(`Dismissed alert ${id}`); // TODO: Remove - replace with API call
  };

  const handleMarkAllRead = () => {
    setAlerts([]);
    console.log("All alerts marked as read"); // TODO: Remove - replace with API call
  };

  const handleFilterChange = (filters: { search: string; status: string; shift: string }) => {
    console.log("Filters changed:", filters); // TODO: Remove - implement actual filtering logic
  };

  const handleExport = () => {
    console.log("Export CSV clicked"); // TODO: Remove - implement CSV export
  };

  const handleViewDetails = (machineId: string) => {
    console.log(`View details for ${machineId}`); // TODO: Remove - navigate to machine detail page
  };

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen bg-background">
        <DashboardHeader
          userRole="SUPERVISOR"
          alertCount={alerts.length}
          onThemeToggle={handleThemeToggle}
          isDark={isDark}
        />

        <main className="container mx-auto p-6 space-y-6 max-w-7xl">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <SummaryCard
              title="Total Machines"
              value={12}
              icon={Server}
              trend={{ value: 8.2, isPositive: true }}
            />
            <SummaryCard
              title="Active Alerts"
              value={alerts.length}
              icon={AlertTriangle}
            />
            <SummaryCard
              title="Today's Usage"
              value="1,245"
              subtitle="liters"
              icon={Activity}
              trend={{ value: 3.1, isPositive: false }}
            />
            <SummaryCard
              title="Low Coolant"
              value={2}
              subtitle="machines"
              icon={TrendingDown}
            />
          </div>

          {/* Main Content Area */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Machine Grid and Charts - 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* Filter Bar */}
              <FilterBar onFilterChange={handleFilterChange} onExport={handleExport} />

              {/* Machine Cards */}
              <div className="grid md:grid-cols-2 gap-6">
                {machines.map((machine) => (
                  <MachineCard
                    key={machine.machineId}
                    {...machine}
                    onViewDetails={() => handleViewDetails(machine.machineId)}
                  />
                ))}
              </div>

              {/* Usage Chart */}
              <UsageChart
                title="24-Hour Coolant Usage Trends"
                data={chartData}
                showRaw={true}
              />

              {/* Data Table */}
              <DataTable
                title="Recent Machine Readings"
                data={readings}
                rowsPerPage={10}
              />
            </div>

            {/* Alert Panel - 1 column */}
            <div className="lg:col-span-1">
              <div className="sticky top-20">
                <AlertPanel
                  alerts={alerts}
                  onDismiss={handleDismissAlert}
                  onMarkAllRead={handleMarkAllRead}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
