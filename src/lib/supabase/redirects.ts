import { prisma } from "@/lib/prisma/client";

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
    return "/onboarding";
  }

  switch (profile.role) {
    case "ADMIN":
      return "/admin/dashboard";
    case "STYLIST":
      return "/stylist/dashboard";
    case "CUSTOMER":
      return "/customer/dashboard";
    default:
      return "/onboarding";
  }
}
