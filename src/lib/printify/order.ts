export async function sendToPrintify(order: any) {
  const PRINTIFY_API_KEY = process.env.PRINTIFY_API_KEY
  const SHOP_ID = process.env.PRINTIFY_SHOP_ID

  if (!PRINTIFY_API_KEY || !SHOP_ID) {
    throw new Error("Missing Printify config")
  }

  const line_items = order.items.map((item: any) => ({
    product_id: item.printify_product_id,
    variant_id: item.printify_variant_id,
    quantity: item.quantity,
  }))

  const response = await fetch(
    `https://api.printify.com/v1/shops/${SHOP_ID}/orders.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PRINTIFY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        external_id: order.id,
        line_items,
        shipping_method: 1,
        send_shipping_notification: true,
        address_to: {
          first_name: order.first_name,
          last_name: order.last_name,
          email: order.email,
          phone: order.phone,
          country: "US",
          region: order.state,
          city: order.city,
          address1: order.address,
          postal_code: order.postal,
        },
      }),
    }
  )

  const data = await response.json()

  if (!response.ok) {
    console.error("Printify Error:", data)
    throw new Error("Failed to send order to Printify")
  }

  return data
}