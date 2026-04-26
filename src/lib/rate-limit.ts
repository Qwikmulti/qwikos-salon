import { NextRequest, NextResponse } from "next/server";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 60 * 1000;
const LIMIT = 10;

export function rateLimit(key: string, limit = LIMIT): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (record.count >= limit) return false;

  record.count++;
  return true;
}

export function getRateLimitKey(req: NextRequest): string {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  return ip.split(",")[0].trim();
}

export function withRateLimit(handler: (req: NextRequest) => Promise<NextResponse>, limit = LIMIT) {
  return async function (req: NextRequest) {
    const key = getRateLimitKey(req);

    if (!rateLimit(key, limit)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    return handler(req);
  };
}