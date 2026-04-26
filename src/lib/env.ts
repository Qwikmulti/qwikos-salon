const REQUIRED = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "DATABASE_URL",
];

export function validateEnv() {
  const missing: string[] = [];

  for (const key of REQUIRED) {
    if (!process.env[key]) missing.push(key);
  }

  if (missing.length > 0) {
    console.error(`Missing required env vars: ${missing.join(", ")}`);
  }

  return missing;
}

if (process.env.NODE_ENV === "production") {
  validateEnv();
}