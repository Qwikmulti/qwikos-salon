import { prisma } from "@/lib/prisma/client";
import { createClient } from "@/lib/supabase/server";

/**
 * Determines the correct redirect path for a user based on their role
 * @param userId The Supabase user ID
 * @returns The relative path to redirect to
 */
export async function getRoleRedirectPath(userId: string): Promise<string> {
  const profile = await prisma.profile.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!profile) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      await prisma.profile.create({
        data: {
          id: userId,
          email: user.email!,
          fullName: user.user_metadata?.full_name ?? "Customer",
          role: "CUSTOMER",
        },
      });
      return "/customer/dashboard";
    }
    return "/login";
  }

  switch (profile.role) {
    case "ADMIN":
      return "/admin/dashboard";
    case "STYLIST":
      return "/stylist/dashboard";
    case "CUSTOMER":
      return "/customer/dashboard";
    default:
      return "/customer/dashboard";
  }
}
