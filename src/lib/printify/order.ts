function toUSCountryCode(country: string | null | undefined) {
  if (!country) return "US"
  const normalized = country.trim().toLowerCase()

  if (
    normalized === "united states" ||
    normalized === "united states of america" ||
    normalized === "usa" ||
    normalized === "us"
  ) {
    return "US"
  }

  return country
}

export async function sendToPrintify(order: any) {
  const apiKey = process.env.PRINTIFY_API_KEY
  const shopId = process.env.PRINTIFY_SHOP_ID

  if (!apiKey || !shopId) {
    throw new Error("Missing Printify credentials")
  }

  if (!order) {
    throw new Error("Missing order payload")
  }

  if (!Array.isArray(order.order_items) || order.order_items.length === 0) {
    throw new Error("Order items not found")
  }

  const lineItems = order.order_items.map((item: any) => {
    if (!item.printify_variant_id) {
      throw new Error(`Missing printify_variant_id for item ${item.id}`)
    }

    return {
      product_id: item.printify_product_id || undefined,
      variant_id: Number(item.printify_variant_id),
      quantity: Number(item.quantity),
    }
  })

  const fullName = String(order.customer_name || "").trim()
  const firstName = fullName.split(" ")[0] || "Customer"
  const lastName = fullName.split(" ").slice(1).join(" ") || "Order"

  const payload = {
    external_id: order.id,
    label: order.order_number,
    line_items: lineItems,
    shipping_method: 1,
    send_shipping_notification: true,
    address_to: {
      first_name: firstName,
      last_name: lastName,
      email: order.customer_email,
      phone: order.customer_phone || "0000000000",
      country: toUSCountryCode(order.shipping_country),
      region: order.shipping_state || "",
      city: order.shipping_city,
      address1: order.shipping_address_line1,
      address2: order.shipping_address_line2 || "",
      zip: order.shipping_postal_code,
    },
  }

  const response = await fetch(
    `https://api.printify.com/v1/shops/${shopId}/orders.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  )

  const data = await response.json()

  if (!response.ok) {
    console.error("Printify payload failed:", payload)
    console.error("Printify response:", data)
    throw new Error(data?.message || "Failed to create Printify order")
  }

  return data
}