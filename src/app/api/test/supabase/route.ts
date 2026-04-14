import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function GET() {
  try {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from("app_settings")
      .select("*")
      .limit(5)

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
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