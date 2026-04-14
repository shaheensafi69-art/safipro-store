import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET

    if (!cronSecret) {
      throw new Error("Missing CRON_SECRET")
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    const response = await fetch(`${baseUrl}/api/suppliers/printify/sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    const data = await response.json()

    return NextResponse.json({
      success: true,
      message: "Printify sync executed",
      data,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}