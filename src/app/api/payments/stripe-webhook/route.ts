import { headers } from "next/headers"
import { NextResponse } from "next/server"
import Stripe from "stripe"
import { getStripe } from "@/lib/payments/stripe"
import { createAdminClient } from "@/lib/supabase/admin"
import { sendOrderEmail } from "@/lib/notifications/email"
import { sendToPrintify } from "@/lib/printify/order"
import { sendTelegramMessage } from "@/lib/notifications/telegram"

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
      const customerEmail = session.customer_email || ""
      const orderNumber = session.metadata?.order_number || "N/A"

      if (!orderId) {
        return NextResponse.json({ received: true })
      }

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (*)
        `)
        .eq("id", orderId)
        .single()

      if (orderError || !order) {
        throw new Error(orderError?.message || "Order not found after payment")
      }

      await supabase
        .from("orders")
        .update({
          payment_status: "paid",
        })
        .eq("id", orderId)

      let printifyError = ""
      let alreadySubmitted = Boolean(order.supplier_order_id)

      if (!alreadySubmitted) {
        try {
          const printifyResult = await sendToPrintify(order)

          await supabase
            .from("orders")
            .update({
              fulfillment_status: "submitted",
              supplier_order_id: printifyResult?.id
                ? String(printifyResult.id)
                : null,
            })
            .eq("id", orderId)
        } catch (error) {
          printifyError =
            error instanceof Error ? error.message : "Printify submission failed"

          await supabase
            .from("orders")
            .update({
              fulfillment_status: "failed",
            })
            .eq("id", orderId)
        }
      }

      try {
        await sendOrderEmail({
          orderNumber,
          customerEmail,
        })
      } catch (error) {
        console.error("Email failed:", error)
      }

      try {
        await sendTelegramMessage(
          `
🛒 <b>New Paid Order</b>

Order: ${orderNumber}
Email: ${customerEmail}
Payment: paid
Fulfillment: ${
            alreadySubmitted
              ? "already submitted"
              : printifyError
              ? "failed"
              : "submitted"
          }

${
  alreadySubmitted
    ? "ℹ️ Order was already sent to Printify"
    : printifyError
    ? `❌ Printify Error: ${printifyError}`
    : "✅ Sent to Printify"
}
          `.trim()
        )
      } catch (error) {
        console.error("Telegram failed:", error)
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