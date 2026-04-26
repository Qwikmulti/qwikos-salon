import { DashboardShell } from "@/components/layout/DashboardShell";

export default function StylistLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell role="stylist" userName="Fatima Hassan">
      {children}
    </DashboardShell>
  );
}
