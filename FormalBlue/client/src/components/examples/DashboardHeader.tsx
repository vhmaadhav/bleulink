import DashboardHeader from "../DashboardHeader";

export default function DashboardHeaderExample() {
  return (
    <DashboardHeader
      userRole="SUPERVISOR"
      alertCount={3}
      isDark={false}
    />
  );
}
