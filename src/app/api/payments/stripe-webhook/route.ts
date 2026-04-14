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

      if (orderId) {
        // 🔥 گرفتن سفارش کامل
        const { data: order } = await supabase
          .from("orders")
          .select("*")
          .eq("id", orderId)
          .single()

        // 🔥 update status
        await supabase
          .from("orders")
          .update({ payment_status: "paid" })
          .eq("id", orderId)

        // 🔥 ارسال به Printify
        try {
          await sendToPrintify(order)
        } catch (e) {
          console.error("Printify failed:", e)
        }

        // 🔥 ایمیل
        await sendOrderEmail({
          orderNumber,
          customerEmail,
        })

        // 🔥 تلگرام
        await sendTelegramMessage(`
🛒 <b>New Order Paid</b>

Order: ${orderNumber}
Email: ${customerEmail}

💰 Status: PAID
📦 Sent to Printify
`)
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