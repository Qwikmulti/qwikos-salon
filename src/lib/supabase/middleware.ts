import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  // Protected route groups
  const protectedPaths = ["/dashboard", "/book", "/bookings", "/availability", "/profile"];
  const adminPaths     = ["/admin"];
  const stylistPaths   = ["/stylist"];
  const authPaths      = ["/login", "/register"];

  const isProtected = protectedPaths.some(p => path.startsWith(p));
  const isAdmin     = adminPaths.some(p => path.startsWith(p));
  const isStylist   = stylistPaths.some(p => path.startsWith(p));
  const isAuth      = authPaths.some(p => path.startsWith(p));

  if (!user && (isProtected || isAdmin || isStylist)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (user && isAuth) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return supabaseResponse;
}
