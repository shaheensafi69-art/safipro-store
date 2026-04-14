"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import AddToCartButton from "@/components/cart/add-to-cart-button"

type ProductImage = {
  id: string
  image_url: string
  alt_text: string | null
  is_primary: boolean
  sort_order: number
}

type ProductVariant = {
  id: string
  sku: string | null
  option_1: string | null
  option_2: string | null
  option_3: string | null
  selling_price: number
  currency: string
  is_available: boolean
  provider_payload: Record<string, any> | null
}

type Product = {
  id: string
  title: string
  slug: string
  full_description: string | null
  description_html: string | null
  supplier_payload: Record<string, any> | null
  status: string
  visible: boolean
  product_images: ProductImage[] | null
  product_variants: ProductVariant[] | null
}

type ParsedVariant = {
  id: string
  sku: string | null
  selling_price: number
  currency: string
  is_available: boolean
  size: string | null
  color: string | null
  colorHex: string | null
  fullLabel: string
}

type PrintifyOptionValue = {
  id: number | string
  title?: string
  colors?: string[]
}

type PrintifyOption = {
  name?: string
  type?: string
  values?: PrintifyOptionValue[]
}

const COLOR_MAP: Record<string, string> = {
  black: "#111111",
  white: "#f5f5f5",
  red: "#dc2626",
  blue: "#2563eb",
  navy: "#1e3a8a",
  green: "#16a34a",
  yellow: "#eab308",
  gold: "#d4af37",
  silver: "#c0c0c0",
  gray: "#6b7280",
  grey: "#6b7280",
  orange: "#f97316",
  purple: "#7c3aed",
  pink: "#ec4899",
  brown: "#7c4a1d",
  beige: "#d6c6a5",
  cream: "#f5f0dc",
  ivory: "#fffff0",
  coral: "#ff7f50",
  mauve: "#b784a7",
  natural: "#e8ddc7",
  mint: "#98ff98",
  forest: "#228b22",
  teal: "#0f766e",
  maroon: "#7f1d1d",
  heather: "#9ca3af",
  "heather orange": "#c97a52",
  "heather deep teal": "#2d6f73",
  "heather prism mint": "#9cc9b3",
}

function normalizeText(value: string | null | undefined) {
  if (!value) return null
  const clean = value.trim()
  return clean.length ? clean : null
}

function normalizeKey(value: string) {
  return value.toLowerCase().trim().replace(/\s+/g, " ")
}

function getFallbackColorHex(color: string | null) {
  if (!color) return null

  const key = normalizeKey(color)

  if (COLOR_MAP[key]) return COLOR_MAP[key]

  const words = key.split(" ")
  for (const word of words) {
    if (COLOR_MAP[word]) return COLOR_MAP[word]
  }

  return null
}

function uniqueStrings(values: Array<string | null>) {
  return [...new Set(values.filter(Boolean))] as string[]
}

function buildPrintifyOptionMaps(product: Product) {
  const options = Array.isArray(product?.supplier_payload?.options)
    ? (product.supplier_payload.options as PrintifyOption[])
    : []

  const colorOption =
    options.find((opt) => opt.type === "color") ||
    options.find((opt) => normalizeKey(opt.name || "") === "colors") ||
    options.find((opt) => normalizeKey(opt.name || "") === "color")

  const sizeOption =
    options.find((opt) => opt.type === "size") ||
    options.find((opt) => normalizeKey(opt.name || "") === "sizes") ||
    options.find((opt) => normalizeKey(opt.name || "") === "size")

  const colorMap = new Map<string, { title: string; hex: string | null }>()
  const sizeMap = new Map<string, string>()

  if (Array.isArray(colorOption?.values)) {
    for (const value of colorOption.values) {
      const key = String(value.id)
      const title = value.title || key
      const hex =
        (Array.isArray(value.colors) && value.colors[0]) ||
        getFallbackColorHex(title)

      colorMap.set(key, {
        title,
        hex: hex || null,
      })
    }
  }

  if (Array.isArray(sizeOption?.values)) {
    for (const value of sizeOption.values) {
      const key = String(value.id)
      const title = value.title || key
      sizeMap.set(key, title)
    }
  }

  return { colorMap, sizeMap }
}

function parseVariant(
  variant: ProductVariant,
  maps: {
    colorMap: Map<string, { title: string; hex: string | null }>
    sizeMap: Map<string, string>
  }
): ParsedVariant {
  const optionIds = Array.isArray(variant?.provider_payload?.options)
    ? variant.provider_payload.options.map((item: unknown) => String(item))
    : []

  let color: string | null = null
  let colorHex: string | null = null
  let size: string | null = null

  for (const optionId of optionIds) {
    const colorValue = maps.colorMap.get(optionId)
    if (colorValue && !color) {
      color = colorValue.title
      colorHex = colorValue.hex
      continue
    }

    const sizeValue = maps.sizeMap.get(optionId)
    if (sizeValue && !size) {
      size = sizeValue
    }
  }

  if (!color && variant.option_1 && !maps.sizeMap.has(String(variant.option_1))) {
    color = normalizeText(variant.option_1)
    colorHex = getFallbackColorHex(color)
  }

  if (!size) {
    if (variant.option_2) {
      size = normalizeText(variant.option_2)
    } else if (variant.option_1 && !color) {
      size = normalizeText(variant.option_1)
    }
  }

  const fullLabel = [color, size].filter(Boolean).join(" / ") || "Default Variant"

  return {
    id: variant.id,
    sku: variant.sku,
    selling_price: variant.selling_price,
    currency: variant.currency,
    is_available: variant.is_available,
    color,
    colorHex,
    size,
    fullLabel,
  }
}

export default function ProductPage() {
  const params = useParams<{ slug: string }>()
  const slug = params?.slug
  const supabase = createClient()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProduct() {
      if (!slug) return

      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from("products")
        .select(`
          id,
          title,
          slug,
          full_description,
          description_html,
          supplier_payload,
          status,
          visible,
          product_images (
            id,
            image_url,
            alt_text,
            is_primary,
            sort_order
          ),
          product_variants (
            id,
            sku,
            option_1,
            option_2,
            option_3,
            selling_price,
            currency,
            is_available,
            provider_payload
          )
        `)
        .eq("slug", slug)
        .eq("status", "active")
        .eq("visible", true)
        .single()

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      setProduct(data as Product)
      setLoading(false)
    }

    loadProduct()
  }, [slug, supabase])

  const images = useMemo(() => {
    if (!product?.product_images || !Array.isArray(product.product_images)) {
      return []
    }

    return [...product.product_images].sort((a, b) => a.sort_order - b.sort_order)
  }, [product])

  const parsedVariants = useMemo(() => {
    if (!product?.product_variants || !Array.isArray(product.product_variants)) {
      return []
    }

    const maps = buildPrintifyOptionMaps(product)
    return product.product_variants.map((variant) => parseVariant(variant, maps))
  }, [product])

  const [selectedImageId, setSelectedImageId] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [showAllColors, setShowAllColors] = useState(false)
  const [showAllSizes, setShowAllSizes] = useState(false)

  useEffect(() => {
    setSelectedImageId(images[0]?.id || null)
  }, [images])

  const availableColors = useMemo(
    () => uniqueStrings(parsedVariants.map((variant) => variant.color)),
    [parsedVariants]
  )

  const hasMultipleColors = availableColors.length > 1

  useEffect(() => {
    if (!hasMultipleColors) {
      setSelectedColor(availableColors[0] || null)
      return
    }

    const firstAvailableColor =
      parsedVariants.find((variant) => variant.is_available && variant.color)?.color ||
      availableColors[0] ||
      null

    setSelectedColor(firstAvailableColor)
  }, [parsedVariants, availableColors, hasMultipleColors])

  const colorFilteredVariants = useMemo(() => {
    if (!hasMultipleColors) return parsedVariants
    if (!selectedColor) return parsedVariants

    return parsedVariants.filter((variant) => variant.color === selectedColor)
  }, [parsedVariants, selectedColor, hasMultipleColors])

  const availableSizes = useMemo(
    () => uniqueStrings(colorFilteredVariants.map((variant) => variant.size)),
    [colorFilteredVariants]
  )

  useEffect(() => {
    const firstAvailableSize =
      colorFilteredVariants.find((variant) => variant.is_available && variant.size)?.size ||
      availableSizes[0] ||
      null

    setSelectedSize(firstAvailableSize)
  }, [colorFilteredVariants, availableSizes])

  const finalSelectedVariant = useMemo(() => {
    if (hasMultipleColors && selectedColor && selectedSize) {
      const exact = parsedVariants.find(
        (variant) =>
          variant.color === selectedColor && variant.size === selectedSize
      )
      if (exact) return exact
    }

    if (!hasMultipleColors && selectedSize) {
      const exactBySize = parsedVariants.find(
        (variant) => variant.size === selectedSize
      )
      if (exactBySize) return exactBySize
    }

    if (hasMultipleColors && selectedColor) {
      const byColor = parsedVariants.find((variant) => variant.color === selectedColor)
      if (byColor) return byColor
    }

    return (
      parsedVariants.find((variant) => variant.is_available) ||
      parsedVariants[0] ||
      null
    )
  }, [parsedVariants, selectedColor, selectedSize, hasMultipleColors])

  const selectedImage =
    images.find((image) => image.id === selectedImageId) || images[0] || null

  const visibleColors = showAllColors ? availableColors : availableColors.slice(0, 5)
  const visibleSizes = showAllSizes ? availableSizes : availableSizes.slice(0, 5)

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 text-white">
        Loading...
      </main>
    )
  }

  if (error || !product) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 text-white">
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
          Product not found
        </div>
        <div className="mt-4">
          <Link href="/shop" className="text-[#D4AF37]">
            Back to shop
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[110px_minmax(0,1fr)_420px]">
        <div className="order-2 flex gap-3 overflow-x-auto lg:order-1 lg:flex-col">
          {images.length > 0 ? (
            images.map((image) => {
              const active = selectedImage?.id === image.id

              return (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => setSelectedImageId(image.id)}
                  className={`shrink-0 overflow-hidden rounded-2xl border transition ${
                    active
                      ? "border-[#D4AF37] shadow-[0_0_18px_rgba(212,175,55,0.22)]"
                      : "border-[#2b2b2b] hover:border-[#D4AF37]/40"
                  }`}
                >
                  <div className="flex h-24 w-24 items-center justify-center bg-[#111111] p-2">
                    <img
                      src={image.image_url}
                      alt={image.alt_text || product.title}
                      className="h-full w-full rounded-xl object-contain"
                    />
                  </div>
                </button>
              )
            })
          ) : (
            <div className="rounded-2xl border border-[#2b2b2b] bg-[#111111] p-4 text-sm text-gray-500">
              No images
            </div>
          )}
        </div>

        <div className="order-1 lg:order-2">
          <div className="overflow-hidden rounded-3xl border border-[#2b2b2b] bg-gradient-to-br from-[#111111] via-[#171717] to-[#0b0b0b] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
            <div className="flex min-h-[420px] items-center justify-center rounded-2xl bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),transparent_55%)] p-6 sm:min-h-[520px]">
              {selectedImage ? (
                <img
                  src={selectedImage.image_url}
                  alt={selectedImage.alt_text || product.title}
                  className="max-h-[540px] w-full object-contain"
                />
              ) : (
                <div className="text-gray-500">No image</div>
              )}
            </div>
          </div>
        </div>

        <div className="order-3 lg:sticky lg:top-6 lg:self-start">
          <div className="mb-4 inline-flex rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/10 px-4 py-1 text-sm font-medium text-[#E6C766]">
            Luxury Collection
          </div>

          <h1 className="text-2xl font-bold leading-tight text-[#D4AF37] sm:text-3xl">
            {product.title}
          </h1>

          {finalSelectedVariant ? (
            <div className="mt-5 rounded-2xl border border-[#2b2b2b] bg-[#0A0A0A]/90 p-4">
              <div className="text-sm text-gray-400">Current price</div>
              <div className="mt-1 text-3xl font-bold text-white">
                {finalSelectedVariant.selling_price}{" "}
                <span className="text-[#D4AF37]">{finalSelectedVariant.currency}</span>
              </div>
              <div className="mt-3 text-sm">
                {finalSelectedVariant.is_available ? (
                  <span className="font-medium text-green-400">In stock</span>
                ) : (
                  <span className="font-medium text-red-400">Out of stock</span>
                )}
              </div>
            </div>
          ) : null}

          <div className="mt-6 rounded-3xl border border-[#2b2b2b] bg-[#0A0A0A]/90 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
            <div className="mb-4 rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 p-4">
              <div className="text-sm text-gray-300">Selected</div>
              <div className="mt-1 font-semibold text-white">
                {hasMultipleColors
                  ? `${selectedColor || "Default"}${selectedSize ? ` / ${selectedSize}` : ""}`
                  : `${selectedSize || "Default"}`}
              </div>
              <div className="mt-2 text-sm text-gray-400">
                SKU: {finalSelectedVariant?.sku || "N/A"}
              </div>
            </div>

            {hasMultipleColors ? (
              <div className="mb-6">
                <div className="mb-3 text-sm font-semibold text-white">Color</div>
                <div className="flex flex-wrap gap-3">
                  {visibleColors.map((color) => {
                    const active = selectedColor === color
                    const swatchHex =
                      parsedVariants.find((variant) => variant.color === color)?.colorHex ||
                      getFallbackColorHex(color)

                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => {
                          setSelectedColor(color)
                          setShowAllSizes(false)
                        }}
                        title={color}
                        className={`relative flex items-center justify-center transition ${
                          swatchHex
                            ? `h-11 w-11 rounded-full border p-1 ${
                                active
                                  ? "border-[#D4AF37] shadow-[0_0_18px_rgba(212,175,55,0.25)]"
                                  : "border-[#2b2b2b] hover:border-[#D4AF37]/40"
                              }`
                            : `rounded-xl border px-3 py-2 text-sm font-medium ${
                                active
                                  ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#E6C766]"
                                  : "border-[#2b2b2b] bg-black/30 text-white hover:border-[#D4AF37]/40"
                              }`
                        }`}
                      >
                        {swatchHex ? (
                          <span
                            className="block h-full w-full rounded-full"
                            style={{ backgroundColor: swatchHex }}
                          />
                        ) : (
                          <span className="text-white">{color}</span>
                        )}
                      </button>
                    )
                  })}
                </div>

                {availableColors.length > 5 ? (
                  <button
                    type="button"
                    onClick={() => setShowAllColors((prev) => !prev)}
                    className="mt-3 text-sm font-medium text-[#D4AF37] hover:text-[#E6C766]"
                  >
                    {showAllColors ? "Show Less" : "View All"}
                  </button>
                ) : null}
              </div>
            ) : null}

            {availableSizes.length > 0 ? (
              <div className="mb-6">
                <div className="mb-3 text-sm font-semibold text-white">Size</div>
                <div className="flex flex-wrap gap-2">
                  {visibleSizes.map((size) => {
                    const matchedVariant = colorFilteredVariants.find(
                      (variant) => variant.size === size
                    )
                    const isAvailable = matchedVariant?.is_available ?? false
                    const active = selectedSize === size

                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        disabled={!isAvailable}
                        className={`min-w-[54px] rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                          active
                            ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#E6C766]"
                            : "border-[#2b2b2b] bg-black/30 text-white hover:border-[#D4AF37]/40"
                        } ${!isAvailable ? "cursor-not-allowed opacity-40 line-through" : ""}`}
                      >
                        {size}
                      </button>
                    )
                  })}
                </div>

                {availableSizes.length > 5 ? (
                  <button
                    type="button"
                    onClick={() => setShowAllSizes((prev) => !prev)}
                    className="mt-3 text-sm font-medium text-[#D4AF37] hover:text-[#E6C766]"
                  >
                    {showAllSizes ? "Show Less" : "View All"}
                  </button>
                ) : null}
              </div>
            ) : null}

            <AddToCartButton
              productId={product.id}
              variantId={finalSelectedVariant?.id || ""}
              title={product.title}
              slug={product.slug}
              image={selectedImage?.image_url || null}
              size={finalSelectedVariant?.size || null}
              color={hasMultipleColors ? finalSelectedVariant?.color || null : null}
              sku={finalSelectedVariant?.sku || null}
              price={finalSelectedVariant?.selling_price || 0}
              currency={finalSelectedVariant?.currency || "USD"}
              disabled={!finalSelectedVariant?.is_available}
            />
          </div>

          {product.full_description ? (
            <div className="mt-6 rounded-3xl border border-[#2b2b2b] bg-[#0A0A0A]/80 p-6">
              <h2 className="mb-4 text-xl font-semibold text-white">
                Product Details
              </h2>
              <div className="prose-custom">
                <p>{product.full_description}</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  )
}