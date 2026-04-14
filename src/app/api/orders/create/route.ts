import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

type CustomerInput = {
  firstName: string
  lastName: string
  email: string
  phone?: string
}

type ShippingAddressInput = {
  country: string
  state?: string
  city: string
  addressLine1: string
  addressLine2?: string
  postalCode: string
}

type OrderItemInput = {
  id: string
  title: string
  slug?: string
  image?: string | null
  color?: string | null
  size?: string | null
  sku?: string | null
  currency?: string
  price: number
  quantity: number

  productId?: string | null
  variantId?: string | null

  printify_product_id?: string | null
  printify_variant_id?: string | null

  supplier_name?: string | null
  supplier_sku?: string | null
}

function generateOrderNumber() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, "0")
  const d = String(now.getDate()).padStart(2, "0")
  const r = Math.floor(1000 + Math.random() * 9000)
  return `SP-${y}${m}${d}-${r}`
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const {
      customer,
      shippingAddress,
      items,
      shippingCost,
    }: {
      customer: CustomerInput
      shippingAddress: ShippingAddressInput
      items: OrderItemInput[]
      shippingCost: number
    } = body

    if (!customer?.firstName?.trim()) {
      return NextResponse.json(
        { success: false, error: "Missing customer first name" },
        { status: 400 }
      )
    }

    if (!customer?.lastName?.trim()) {
      return NextResponse.json(
        { success: false, error: "Missing customer last name" },
        { status: 400 }
      )
    }

    if (!customer?.email?.trim()) {
      return NextResponse.json(
        { success: false, error: "Missing customer email" },
        { status: 400 }
      )
    }

    if (!shippingAddress?.country?.trim()) {
      return NextResponse.json(
        { success: false, error: "Missing country" },
        { status: 400 }
      )
    }

    if (!shippingAddress?.state?.trim()) {
      return NextResponse.json(
        { success: false, error: "Missing state" },
        { status: 400 }
      )
    }

    if (!shippingAddress?.city?.trim()) {
      return NextResponse.json(
        { success: false, error: "Missing city" },
        { status: 400 }
      )
    }

    if (!shippingAddress?.addressLine1?.trim()) {
      return NextResponse.json(
        { success: false, error: "Missing address" },
        { status: 400 }
      )
    }

    if (!shippingAddress?.postalCode?.trim()) {
      return NextResponse.json(
        { success: false, error: "Missing postal code" },
        { status: 400 }
      )
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "No order items provided" },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    const subtotal = items.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
      0
    )

    const safeShippingCost = Number(shippingCost || 0)
    const totalAmount = subtotal + safeShippingCost
    const orderNumber = generateOrderNumber()
    const customerName = `${customer.firstName} ${customer.lastName}`.trim()

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_email: customer.email,
        customer_name: customerName,
        customer_phone: customer.phone || null,

        shipping_country: shippingAddress.country,
        shipping_state: shippingAddress.state || null,
        shipping_city: shippingAddress.city,
        shipping_address_line1: shippingAddress.addressLine1,
        shipping_address_line2: shippingAddress.addressLine2 || null,
        shipping_postal_code: shippingAddress.postalCode,

        subtotal,
        shipping_cost: safeShippingCost,
        total_amount: totalAmount,

        payment_status: "pending",
        fulfillment_status: "pending",
        currency: "USD",
      })
      .select()
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

    const orderItemsPayload = items.map((item) => {
      const lineTotal = Number(item.price || 0) * Number(item.quantity || 0)

      return {
        order_id: order.id,
        product_id: item.productId || item.id || null,
        variant_id: item.variantId || null,
        title_snapshot: item.title,
        variant_snapshot: [item.color, item.size].filter(Boolean).join(" / ") || null,
        image_snapshot: item.image || null,
        sku: item.sku || null,
        quantity: Number(item.quantity || 0),
        unit_price: Number(item.price || 0),
        line_total: lineTotal,
        currency: item.currency || "USD",
        printify_product_id: item.printify_product_id || null,
        printify_variant_id: item.printify_variant_id || null,
        supplier_name: item.supplier_name || "printify",
        supplier_sku: item.supplier_sku || item.sku || null,
      }
    })

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItemsPayload)

    if (itemsError) {
      await supabase.from("orders").delete().eq("id", order.id)

      return NextResponse.json(
        {
          success: false,
          error: itemsError.message || "Failed to create order items",
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