import DataTable, { ReadingData } from "../DataTable";

export default function DataTableExample() {
  const mockData: ReadingData[] = Array.from({ length: 25 }, (_, i) => ({
    id: `reading-${i}`,
    machineId: `CNC-00${(i % 3) + 1}`,
    timestamp: new Date(Date.now() - i * 3600000).toLocaleString(),
    rawLevel: 90 - i * 2,
    mixedLevel: 85 - i * 2.5,
    flowRate: 5 + Math.random() * 2,
    mixRatio: 9.5 + Math.random(),
  }));

  return (
    <div className="p-6">
      <DataTable
        title="Recent Machine Readings"
        data={mockData}
        rowsPerPage={10}
      />
    </div>
  );
}
