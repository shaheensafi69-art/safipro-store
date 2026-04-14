import { NextResponse } from "next/server"
import { sendTelegramMessage } from "@/lib/notifications/telegram"

export async function GET() {
  await sendTelegramMessage("🔥 SafiPro Telegram Test موفق شد")

  return NextResponse.json({ success: true })
}