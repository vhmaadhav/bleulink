import SummaryCard from "../SummaryCard";
import { Server, AlertTriangle, Activity, TrendingDown } from "lucide-react";

export default function SummaryCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      <SummaryCard
        title="Total Machines"
        value={12}
        icon={Server}
        trend={{ value: 8.2, isPositive: true }}
      />
      <SummaryCard
        title="Active Alerts"
        value={3}
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
  );
}
