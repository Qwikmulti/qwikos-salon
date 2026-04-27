"use server";

import { getRoleRedirectPath } from "@/lib/supabase/redirects";
import { createClient } from "@/lib/supabase/server";

export async function getAuthRedirectAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return "/login";
  }

  return getRoleRedirectPath(user.id);
}
