import { DashboardShell } from "@/components/layout/DashboardShell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell role="admin" userName="Admin">
      {children}
    </DashboardShell>
  );
}
