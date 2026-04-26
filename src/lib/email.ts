import Resend from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "SalonOS <noreply@salonos.com>";

export interface BookingEmailData {
  customerEmail: string;
  customerName: string;
  stylistName: string;
  serviceName: string;
  startAt: Date;
  endAt: Date;
  price: number;
  bookingId: string;
}

export async function sendBookingConfirmation(data: BookingEmailData) {
  if (!resend) {
    console.log("[email] Resend not configured, skipping:", data);
    return { success: false };
  }

  const dateStr = data.startAt.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeStr = `${data.startAt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} - ${data.endAt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.customerEmail,
      subject: `Booking Confirmed — ${data.serviceName} with ${data.stylistName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1a1a1a;">Booking Confirmed!</h1>
          <p style="color: #666;">Hi ${data.customerName},</p>
          <p style="color: #666;">Your appointment has been confirmed.</p>
          
          <div style="background: #f5f5f5; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p style="margin: 0 0 10px;"><strong>Service:</strong> ${data.serviceName}</p>
            <p style="margin: 0 0 10px;"><strong>Stylist:</strong> ${data.stylistName}</p>
            <p style="margin: 0 0 10px;"><strong>Date:</strong> ${dateStr}</p>
            <p style="margin: 0 0 10px;"><strong>Time:</strong> ${timeStr}</p>
            <p style="margin: 0;"><strong>Price:</strong> £${(data.price / 100).toFixed(2)}</p>
          </div>
          
          <p style="color: #666; font-size: 14px;">Need to reschedule? Visit your booking history to cancel or contact us.</p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">SalonOS</p>
        </div>
      `,
    });
    return { success: true };
  } catch (err) {
    console.error("[email] Failed to send:", err);
    return { success: false };
  }
}

export async function sendBookingCancellation(data: BookingEmailData & { reason?: string }) {
  if (!resend) {
    console.log("[email] Resend not configured, skipping cancellation:", data);
    return { success: false };
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.customerEmail,
      subject: "Booking Cancelled — SalonOS",
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1a1a1a;">Booking Cancelled</h1>
          <p style="color: #666;">Hi ${data.customerName},</p>
          <p style="color: #666;">Your appointment has been cancelled.</p>
          
          <div style="background: #f5f5f5; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p style="margin: 0 0 10px;"><strong>Service:</strong> ${data.serviceName}</p>
            <p style="margin: 0 0 10px;"><strong>Stylist:</strong> ${data.stylistName}</p>
            ${data.reason ? `<p style="margin: 0;"><strong>Reason:</strong> ${data.reason}</p>` : ""}
          </div>
          
          <p style="color: #666; font-size: 14px;">Ready to book again? Visit our booking page.</p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">SalonOS</p>
        </div>
      `,
    });
    return { success: true };
  } catch (err) {
    console.error("[email] Failed to send cancellation:", err);
    return { success: false };
  }
}

export async function sendStylistNotification(data: BookingEmailData) {
  if (!resend) {
    console.log("[email] Resend not configured, skipping stylist notification:", data);
    return { success: false };
  }

  const dateStr = data.startAt.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeStr = `${data.startAt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} - ${data.endAt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.customerEmail,
      subject: `New Booking — ${data.serviceName} with ${data.customerName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1a1a1a;">New Booking!</h1>
          <p style="color: #666;">Hi ${data.stylistName},</p>
          <p style="color: #666;">You have a new appointment.</p>
          
          <div style="background: #f5f5f5; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p style="margin: 0 0 10px;"><strong>Client:</strong> ${data.customerName}</p>
            <p style="margin: 0 0 10px;"><strong>Service:</strong> ${data.serviceName}</p>
            <p style="margin: 0 0 10px;"><strong>Date:</strong> ${dateStr}</p>
            <p style="margin: 0;"><strong>Time:</strong> ${timeStr}</p>
          </div>
          
          <p style="color: #999; font-size: 12px; margin-top: 30px;">SalonOS</p>
        </div>
      `,
    });
    return { success: true };
  } catch (err) {
    console.error("[email] Failed to send stylist notification:", err);
    return { success: false };
  }
}