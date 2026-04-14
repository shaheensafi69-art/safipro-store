import { NextResponse } from "next/server"
import { getStripe } from "@/lib/payments/stripe"

type CheckoutItem = {
  title: string
  image: string | null
  color: string | null
  size: string | null
  price: number
  quantity: number
}

export async function POST(req: Request) {
  try {
    const stripe = getStripe()
    const body = await req.json()

    const {
      orderId,
      orderNumber,
      customerEmail,
      items,
      shippingCost,
    }: {
      orderId: string
      orderNumber: string
      customerEmail: string
      items: CheckoutItem[]
      shippingCost: number
    } = body

    if (!orderId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid checkout payload" },
        { status: 400 }
      )
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL

    if (!baseUrl) {
      return NextResponse.json(
        { success: false, error: "Missing NEXT_PUBLIC_APP_URL" },
        { status: 500 }
      )
    }

    const lineItems: any[] = items.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: "usd",
        unit_amount: Math.round(item.price * 100),
        product_data: {
          name: item.title,
          ...([item.color, item.size].filter(Boolean).length > 0
            ? {
                description: [item.color, item.size]
                  .filter(Boolean)
                  .join(" / "),
              }
            : {}),
          ...(item.image ? { images: [item.image] } : {}),
        },
      },
    }))

    if (shippingCost > 0) {
      lineItems.push({
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(shippingCost * 100),
          product_data: {
            name: "Shipping",
          },
        },
      })
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: customerEmail,
      line_items: lineItems,
      success_url: `${baseUrl}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout`,
      client_reference_id: orderId,
      metadata: {
        order_id: orderId,
        order_number: orderNumber,
      },
    })

    return NextResponse.json({
      success: true,
      url: session.url,
      sessionId: session.id,
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