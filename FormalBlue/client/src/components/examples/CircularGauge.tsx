import CircularGauge from "../CircularGauge";

export default function CircularGaugeExample() {
  return (
    <div className="flex gap-8 p-8">
      <CircularGauge value={85.2} label="Mixed Coolant" size="md" />
      <CircularGauge value={32.5} label="Raw Coolant" size="md" />
      <CircularGauge value={15.8} label="Low Level" size="md" />
    </div>
  );
}
