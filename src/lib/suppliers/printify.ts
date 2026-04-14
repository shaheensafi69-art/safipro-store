const PRINTIFY_API_URL = "https://api.printify.com/v1"

function getPrintifyHeaders() {
  const apiKey = process.env.PRINTIFY_API_KEY

  if (!apiKey) {
    throw new Error("Missing PRINTIFY_API_KEY")
  }

  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  }
}

function getPrintifyShopId() {
  const shopId = process.env.PRINTIFY_SHOP_ID

  if (!shopId) {
    throw new Error("Missing PRINTIFY_SHOP_ID")
  }

  return shopId
}

export async function getPrintifyProducts() {
  const shopId = getPrintifyShopId()

  const res = await fetch(`${PRINTIFY_API_URL}/shops/${shopId}/products.json`, {
    headers: getPrintifyHeaders(),
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error(`Printify products request failed: ${res.status}`)
  }

  return res.json()
}

export async function getPrintifyProductById(productId: string) {
  const shopId = getPrintifyShopId()

  const res = await fetch(
    `${PRINTIFY_API_URL}/shops/${shopId}/products/${productId}.json`,
    {
      headers: getPrintifyHeaders(),
      cache: "no-store",
    }
  )

  if (!res.ok) {
    throw new Error(`Printify product request failed: ${res.status}`)
  }

  return res.json()
}