import { NextResponse } from "next/server"
import { sendOrderEmail } from "@/lib/notifications/email"

export async function GET() {
  await sendOrderEmail({
    orderNumber: "TEST-EMAIL",
    customerEmail: "test@safipro.com",
  })

  return NextResponse.json({ success: true })
}