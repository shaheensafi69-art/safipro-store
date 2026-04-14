import { NextResponse } from "next/server"
import { stripe } from "@/lib/payments/stripe"
import { createAdminClient } from "@/lib/supabase/admin"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get("session_id")

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "Missing session_id" },
        { status: 400 }
      )
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    const orderId =
      session.metadata?.order_id || session.client_reference_id || null

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Order reference not found in session" },
        { status: 404 }
      )
    }

    const supabase = createAdminClient()

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select(`
        id,
        order_number,
        customer_email,
        customer_name,
        total_amount,
        subtotal,
        shipping_cost,
        payment_status,
        fulfillment_status,
        created_at,
        order_items (
          id,
          title_snapshot,
          variant_snapshot,
          image_snapshot,
          quantity,
          unit_price,
          line_total
        )
      `)
      .eq("id", orderId)
      .single()

    if (orderError || !order) {
      return NextResponse.json(
        {
          success: false,
          error: orderError?.message || "Order not found",
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        payment_status: session.payment_status,
        status: session.status,
      },
      order,
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