import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

type CheckoutItem = {
  id: string
  productId: string
  variantId: string
  title: string
  slug: string
  image: string | null
  size: string | null
  color: string | null
  sku: string | null
  price: number
  currency: string
  quantity: number
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const {
      customer,
      shippingAddress,
      notes,
      items,
    }: {
      customer: {
        firstName: string
        lastName: string
        email: string
        phone?: string
      }
      shippingAddress: {
        country: string
        city: string
        addressLine1: string
        addressLine2?: string
        postalCode?: string
      }
      notes?: string
      items: CheckoutItem[]
    } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Cart is empty" },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )

    const shippingCost = subtotal >= 100 ? 0 : 9.99
    const totalAmount = subtotal + shippingCost

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_email: customer.email,
        customer_name: `${customer.firstName} ${customer.lastName}`.trim(),
        customer_phone: customer.phone || null,
        currency: "USD",
        subtotal,
        shipping_cost: shippingCost,
        discount_amount: 0,
        total_amount: totalAmount,
        payment_method: "stripe",
        payment_status: "pending",
        fulfillment_status: "unfulfilled",
        shipping_address: {
          firstName: customer.firstName,
          lastName: customer.lastName,
          country: shippingAddress.country,
          city: shippingAddress.city,
          addressLine1: shippingAddress.addressLine1,
          addressLine2: shippingAddress.addressLine2 || "",
          postalCode: shippingAddress.postalCode || "",
        },
        notes: notes || null,
      })
      .select("id, order_number, total_amount, currency")
      .single()

    if (orderError || !order) {
      return NextResponse.json(
        {
          success: false,
          error: orderError?.message || "Failed to create order",
        },
        { status: 500 }
      )
    }

    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      variant_id: item.variantId,
      provider: "printify",
      title_snapshot: item.title,
      variant_snapshot: [item.color, item.size].filter(Boolean).join(" / ") || null,
      image_snapshot: item.image,
      quantity: item.quantity,
      unit_price: item.price,
      line_total: item.price * item.quantity,
      metadata: {
        slug: item.slug,
        sku: item.sku,
        color: item.color,
        size: item.size,
      },
    }))

    const { error: orderItemsError } = await supabase
      .from("order_items")
      .insert(orderItems)

    if (orderItemsError) {
      return NextResponse.json(
        {
          success: false,
          error: orderItemsError.message,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
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