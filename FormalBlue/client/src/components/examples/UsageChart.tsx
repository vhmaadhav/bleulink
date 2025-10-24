import UsageChart from "../UsageChart";

export default function UsageChartExample() {
  const mockData = [
    { time: "00:00", mixedCoolant: 95, rawCoolant: 88 },
    { time: "04:00", mixedCoolant: 92, rawCoolant: 85 },
    { time: "08:00", mixedCoolant: 87, rawCoolant: 82 },
    { time: "12:00", mixedCoolant: 78, rawCoolant: 75 },
    { time: "16:00", mixedCoolant: 65, rawCoolant: 68 },
    { time: "20:00", mixedCoolant: 52, rawCoolant: 62 },
    { time: "24:00", mixedCoolant: 45, rawCoolant: 58 },
  ];

  return (
    <div className="p-6">
      <UsageChart
        title="24-Hour Coolant Usage Trends"
        data={mockData}
        showRaw={true}
      />
    </div>
  );
}
