import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getRoleRedirectPath } from "@/lib/supabase/redirects";

export default async function DashboardRedirectPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const redirectPath = await getRoleRedirectPath(user.id);
  redirect(redirectPath);
}
