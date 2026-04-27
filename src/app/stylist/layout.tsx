import { DashboardShell } from "@/components/layout/DashboardShell";
import { prisma } from "@/lib/prisma/client";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function StylistLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    include: { stylist: true },
  });

  if (!profile?.stylist) redirect("/onboarding");

  return (
    <DashboardShell 
      role="stylist" 
      status={profile.stylist.status}
      userName={profile.fullName}
      avatarUrl={profile.avatarUrl || undefined}
    >
      {children}
    </DashboardShell>
  );
}
