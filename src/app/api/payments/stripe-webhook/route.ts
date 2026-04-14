import { headers } from "next/headers"
import { NextResponse } from "next/server"
import Stripe from "stripe"
import { getStripe } from "@/lib/payments/stripe"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get("stripe-signature")
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { success: false, error: "Missing webhook signature or secret" },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Webhook signature verification failed",
      },
      { status: 400 }
    )
  }

  try {
    const supabase = createAdminClient()

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session
      const orderId = session.metadata?.order_id || session.client_reference_id

      if (orderId) {
        await supabase
          .from("orders")
          .update({
            payment_status: "paid",
          })
          .eq("id", orderId)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Webhook handling failed",
      },
      { status: 500 }
    )
  }
}