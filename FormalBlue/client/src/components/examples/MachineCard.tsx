import MachineCard from "../MachineCard";

export default function MachineCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      <MachineCard
        machineId="CNC-001"
        name="High Precision Lathe"
        status="normal"
        mixedCoolantLevel={85.2}
        rawCoolantLevel={78.5}
        flowRate={5.1}
        mixRatio={10.2}
        onViewDetails={() => console.log("View CNC-001 details")}
      />
      <MachineCard
        machineId="CNC-002"
        name="Vertical Mill"
        status="warning"
        mixedCoolantLevel={32.5}
        rawCoolantLevel={62.0}
        flowRate={4.8}
        mixRatio={9.8}
        timeToRefill="6h"
        onViewDetails={() => console.log("View CNC-002 details")}
      />
      <MachineCard
        machineId="CNC-003"
        name="Grinding Machine"
        status="critical"
        mixedCoolantLevel={15.8}
        rawCoolantLevel={45.3}
        flowRate={6.2}
        mixRatio={11.5}
        timeToRefill="2h"
        onViewDetails={() => console.log("View CNC-003 details")}
      />
    </div>
  );
}
