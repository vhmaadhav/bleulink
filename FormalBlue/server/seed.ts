import { storage } from "./storage";

async function seedMachines() {
  console.log("Seeding machines...");

  const machines = [
    {
      machineId: "CNC-001",
      name: "High Precision Lathe",
      location: "Bay A-1",
      standardMixRatio: 1.0, // Mixed coolant level should be approximately equal to raw coolant level
      status: "normal" as const,
    },
    {
      machineId: "CNC-002",
      name: "Vertical Mill",
      location: "Bay A-2",
      standardMixRatio: 1.0,
      status: "normal" as const,
    },
    {
      machineId: "CNC-003",
      name: "Grinding Machine",
      location: "Bay B-1",
      standardMixRatio: 1.0,
      status: "normal" as const,
    },
  ];

  for (const machine of machines) {
    try {
      const existing = await storage.getMachineByMachineId(machine.machineId);
      if (!existing) {
        await storage.createMachine(machine);
        console.log(`✓ Created machine: ${machine.machineId}`);
      } else {
        console.log(`- Machine already exists: ${machine.machineId}`);
      }
    } catch (error) {
      console.error(`Error creating machine ${machine.machineId}:`, error);
    }
  }

  console.log("Seeding complete!");
}

export { seedMachines };
