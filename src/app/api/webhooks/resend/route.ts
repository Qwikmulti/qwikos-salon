import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;

const eventSchema = z.object({
  type: z.string(),
  data: z.record(z.unknown()),
});

export async function POST(req: NextRequest) {
  if (!resend || !webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 501 });
  }

  const signature = req.headers.get("resend-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const event = eventSchema.parse(body);

    console.log(`[webhook] Received: ${event.type}`);

    switch (event.type) {
      case "email.sent":
        console.log("[webhook] Email sent:", event.data);
        break;
      case "email.delivered":
        console.log("[webhook] Email delivered:", event.data);
        break;
      case "email.bounced":
        console.log("[webhook] Email bounced:", event.data);
        break;
      case "email.opened":
        console.log("[webhook] Email opened:", event.data);
        break;
      case "email.clicked":
        console.log("[webhook] Email clicked:", event.data);
        break;
      default:
        console.log("[webhook] Unknown event:", event.type);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[webhook] Error:", err);
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}