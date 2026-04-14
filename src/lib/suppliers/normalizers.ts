function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

function stripHtml(html?: string | null) {
  if (!html) return null

  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim()
}

function toMoneyAmount(value: unknown) {
  const num = Number(value)

  if (!Number.isFinite(num)) return 0

  return Number((num / 100).toFixed(2))
}

export function normalizePrintifyProduct(product: any) {
  const title = product?.title?.trim() || "Untitled Product"
  const plainDescription = stripHtml(product?.description)

  return {
    provider: "printify",
    external_product_id: String(product?.id),
    title,
    slug: slugify(`${title}-${String(product?.id).slice(-6)}`),
    short_description: plainDescription?.slice(0, 220) || null,
    full_description: plainDescription || null,
    description_html: product?.description || null,
    brand: "SafiPro",
    status: product?.visible ? "active" : "draft",
    featured: false,
    visible: Boolean(product?.visible),
    is_locked: Boolean(product?.is_locked),
    supplier_title: product?.title || null,
    supplier_description: product?.description || null,
    supplier_payload: product,
    seo_title: title,
    seo_description: plainDescription?.slice(0, 160) || title,
  }
}

export function normalizePrintifyVariants(productId: string, product: any) {
  const variants = Array.isArray(product?.variants) ? product.variants : []

  const enabledVariants = variants.filter((variant: any) => {
    if (typeof variant?.is_enabled === "boolean") {
      return variant.is_enabled === true
    }

    return true
  })

  return enabledVariants.map((variant: any) => {
    const options = Array.isArray(variant?.options) ? variant.options : []

    return {
      product_id: productId,
      external_variant_id: String(variant?.id),
      sku: variant?.sku || null,
      option_1: options[0] ?? null,
      option_2: options[1] ?? null,
      option_3: options[2] ?? null,
      supplier_cost: toMoneyAmount(variant?.cost),
      shipping_cost_estimate: 0,
      selling_price: toMoneyAmount(variant?.price),
      compare_price: null,
      currency: "USD",
      stock_quantity: variant?.is_available ? 9999 : 0,
      is_available: Boolean(variant?.is_available),
      weight: null,
      weight_unit: null,
      provider_payload: variant,
    }
  })
}

export function normalizePrintifyImages(productId: string, product: any) {
  const images = Array.isArray(product?.images) ? product.images : []

  return images.map((image: any, index: number) => ({
    product_id: productId,
    variant_id: null,
    image_url: image?.src,
    alt_text: product?.title || null,
    sort_order: index,
    is_primary: index === 0,
  }))
}