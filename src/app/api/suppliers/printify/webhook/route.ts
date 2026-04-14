import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log("Printify webhook received:", body)

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL

    if (!baseUrl) {
      return NextResponse.json(
        { success: false, error: "Missing NEXT_PUBLIC_APP_URL" },
        { status: 500 }
      )
    }

    // فوراً sync را اجرا می‌کنیم
    await fetch(`${baseUrl}/api/suppliers/printify/sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    return NextResponse.json({ success: true, received: true })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Webhook failed",
      },
      { status: 500 }
    )
  }
}