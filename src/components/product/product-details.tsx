"use client"

import { useEffect, useMemo, useState } from "react"

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

type ProductDetailsProps = {
  title: string
  full_description: string | null
  images?: ProductImage[]
  variants?: ProductVariant[]
}

type ParsedVariant = {
  id: string
  sku: string | null
  selling_price: number
  currency: string
  is_available: boolean
  provider_payload: Record<string, any> | null
  size: string | null
  color: string | null
  fullLabel: string
}

const SIZE_TOKENS = new Set([
  "xxs",
  "xs",
  "s",
  "m",
  "l",
  "xl",
  "xxl",
  "2xl",
  "3xl",
  "4xl",
  "5xl",
  "6xl",
  "7xl",
  "8xl",
  "9xl",
  "10xl",
  "small",
  "medium",
  "large",
  "x-large",
  "xx-large",
])

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
  heather: "#9ca3af",
  maroon: "#7f1d1d",
}

function normalizeText(value: string | null | undefined) {
  if (!value) return null
  const clean = value.trim()
  return clean.length ? clean : null
}

function normalizeKey(value: string) {
  return value.toLowerCase().trim().replace(/\s+/g, " ")
}

function isLikelySize(value: string) {
  const key = normalizeKey(value)
  return SIZE_TOKENS.has(key)
}

function getColorHex(color: string | null) {
  if (!color) return null

  const key = normalizeKey(color)

  if (COLOR_MAP[key]) return COLOR_MAP[key]

  const words = key.split(" ")
  for (const word of words) {
    if (COLOR_MAP[word]) return COLOR_MAP[word]
  }

  return null
}

function parseVariant(variant: ProductVariant): ParsedVariant {
  const rawTitle =
    normalizeText(variant.provider_payload?.title) ||
    normalizeText(variant.provider_payload?.name)

  const titleParts = rawTitle
    ? rawTitle
        .split("/")
        .map((part: string) => part.trim())
        .filter(Boolean)
    : []

  const fallbackOptions = [
    normalizeText(variant.option_1),
    normalizeText(variant.option_2),
    normalizeText(variant.option_3),
  ].filter(Boolean) as string[]

  const parts = titleParts.length > 0 ? titleParts : fallbackOptions

  let size: string | null = null
  let color: string | null = null

  for (const part of parts) {
    if (!size && isLikelySize(part)) {
      size = part
      continue
    }
  }

  for (const part of parts) {
    if (part !== size) {
      color = part
      break
    }
  }

  if (!size && parts.length === 1) {
    size = parts[0]
  }

  if (!color && parts.length >= 2) {
    color = parts[1]
  }

  return {
    id: variant.id,
    sku: variant.sku,
    selling_price: variant.selling_price,
    currency: variant.currency,
    is_available: variant.is_available,
    provider_payload: variant.provider_payload,
    size,
    color,
    fullLabel: parts.join(" / ") || "Default Variant",
  }
}

function uniqueStrings(values: Array<string | null>) {
  return [...new Set(values.filter(Boolean))] as string[]
}

export default function ProductDetails({
  title,
  full_description,
  images = [],
  variants = [],
}: ProductDetailsProps) {
  const safeImages = Array.isArray(images) ? images : []
  const safeVariants = Array.isArray(variants) ? variants : []

  const parsedVariants = useMemo(
    () => safeVariants.map(parseVariant),
    [safeVariants]
  )

  const sortedImages = useMemo(
    () => [...safeImages].sort((a, b) => a.sort_order - b.sort_order),
    [safeImages]
  )

  const [selectedImageId, setSelectedImageId] = useState<string | null>(
    sortedImages[0]?.id || null
  )

  const selectedImage =
    sortedImages.find((image) => image.id === selectedImageId) ||
    sortedImages[0] ||
    null

  const availableColors = useMemo(
    () => uniqueStrings(parsedVariants.map((variant) => variant.color)),
    [parsedVariants]
  )

  const defaultColor = useMemo(() => {
    const firstAvailableWithColor = parsedVariants.find(
      (variant) => variant.is_available && variant.color
    )
    return firstAvailableWithColor?.color || availableColors[0] || null
  }, [parsedVariants, availableColors])

  const [selectedColor, setSelectedColor] = useState<string | null>(defaultColor)

  useEffect(() => {
    setSelectedColor(defaultColor)
  }, [defaultColor])

  const colorFilteredVariants = useMemo(() => {
    if (!selectedColor) return parsedVariants
    return parsedVariants.filter((variant) => variant.color === selectedColor)
  }, [parsedVariants, selectedColor])

  const availableSizesForSelectedColor = useMemo(
    () => uniqueStrings(colorFilteredVariants.map((variant) => variant.size)),
    [colorFilteredVariants]
  )

  const defaultSize = useMemo(() => {
    const firstAvailable = colorFilteredVariants.find(
      (variant) => variant.is_available && variant.size
    )
    if (firstAvailable?.size) return firstAvailable.size

    const firstAny = colorFilteredVariants.find((variant) => variant.size)
    return firstAny?.size || availableSizesForSelectedColor[0] || null
  }, [colorFilteredVariants, availableSizesForSelectedColor])

  const [selectedSize, setSelectedSize] = useState<string | null>(defaultSize)

  useEffect(() => {
    setSelectedSize(defaultSize)
  }, [defaultSize])

  const finalSelectedVariant = useMemo(() => {
    if (selectedColor && selectedSize) {
      const exact = parsedVariants.find(
        (variant) =>
          variant.color === selectedColor && variant.size === selectedSize
      )
      if (exact) return exact
    }

    if (selectedColor) {
      const firstByColor = parsedVariants.find(
        (variant) => variant.color === selectedColor
      )
      if (firstByColor) return firstByColor
    }

    return (
      parsedVariants.find((variant) => variant.is_available) ||
      parsedVariants[0] ||
      null
    )
  }, [parsedVariants, selectedColor, selectedSize])

  const [showAllColors, setShowAllColors] = useState(false)
  const [showAllSizes, setShowAllSizes] = useState(false)

  const visibleColors = showAllColors
    ? availableColors
    : availableColors.slice(0, 5)

  const visibleSizes = showAllSizes
    ? availableSizesForSelectedColor
    : availableSizesForSelectedColor.slice(0, 5)

  const hasColors = availableColors.length > 0
  const hasSizes = availableSizesForSelectedColor.length > 0

  return (
    <div className="grid gap-8 lg:grid-cols-[110px_minmax(0,1fr)_420px]">
      <div className="order-2 flex gap-3 overflow-x-auto lg:order-1 lg:flex-col">
        {sortedImages.length > 0 ? (
          sortedImages.map((image) => {
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
                    alt={image.alt_text || title}
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
                alt={selectedImage.alt_text || title}
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
          {title}
        </h1>

        {finalSelectedVariant ? (
          <div className="mt-5 rounded-2xl border border-[#2b2b2b] bg-[#0A0A0A]/90 p-4">
            <div className="text-sm text-gray-400">Current price</div>
            <div className="mt-1 text-3xl font-bold text-white">
              {finalSelectedVariant.selling_price}{" "}
              <span className="text-[#D4AF37]">
                {finalSelectedVariant.currency}
              </span>
            </div>

            <div className="mt-3 text-sm">
              {finalSelectedVariant.is_available ? (
                <span className="font-medium text-green-400">In stock</span>
              ) : (
                <span className="font-medium text-red-400">Out of stock</span>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-[#2b2b2b] bg-[#0A0A0A]/90 p-4 text-sm text-gray-400">
            No variants available
          </div>
        )}

        <div className="mt-6 rounded-3xl border border-[#2b2b2b] bg-[#0A0A0A]/90 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
          <div className="mb-4 rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 p-4">
            <div className="text-sm text-gray-300">Selected</div>
            <div className="mt-1 font-semibold text-white">
              {selectedColor || "Default"}{selectedSize ? ` / ${selectedSize}` : ""}
            </div>
            <div className="mt-2 text-sm text-gray-400">
              SKU: {finalSelectedVariant?.sku || "N/A"}
            </div>
          </div>

          {hasColors ? (
            <div className="mb-6">
              <div className="mb-3 text-sm font-semibold text-white">Color</div>

              <div className="flex flex-wrap gap-3">
                {visibleColors.map((color) => {
                  const active = selectedColor === color
                  const swatch = getColorHex(color)

                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => {
                        setSelectedColor(color)
                        setShowAllSizes(false)
                      }}
                      title={color}
                      className={`relative flex items-center justify-center rounded-full border transition ${
                        active
                          ? "border-[#D4AF37] shadow-[0_0_18px_rgba(212,175,55,0.25)]"
                          : "border-[#2b2b2b] hover:border-[#D4AF37]/40"
                      } ${
                        swatch ? "h-11 w-11 p-1" : "rounded-xl px-3 py-2 text-sm font-medium"
                      }`}
                    >
                      {swatch ? (
                        <span
                          className="block h-full w-full rounded-full"
                          style={{ backgroundColor: swatch }}
                        />
                      ) : (
                        <span className="text-white">{color}</span>
                      )}

                      {active ? (
                        <span className="absolute -bottom-6 text-[11px] font-medium text-[#E6C766]">
                          {color}
                        </span>
                      ) : null}
                    </button>
                  )
                })}
              </div>

              {availableColors.length > 5 ? (
                <button
                  type="button"
                  onClick={() => setShowAllColors((prev) => !prev)}
                  className="mt-7 text-sm font-medium text-[#D4AF37] hover:text-[#E6C766]"
                >
                  {showAllColors ? "Show Less" : "View All"}
                </button>
              ) : null}
            </div>
          ) : null}

          {hasSizes ? (
            <div className="mb-6">
              <div className="mb-3 text-sm font-semibold text-white">Size</div>

              <div className="flex flex-wrap gap-2">
                {visibleSizes.map((size) => {
                  const active = selectedSize === size

                  const matchedVariant = colorFilteredVariants.find(
                    (variant) => variant.size === size
                  )

                  const isAvailable = matchedVariant?.is_available ?? false

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

              {availableSizesForSelectedColor.length > 5 ? (
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

          <button
            type="button"
            disabled={!finalSelectedVariant?.is_available}
            className="mt-2 w-full rounded-2xl bg-[#D4AF37] px-4 py-3 font-semibold text-black transition hover:bg-[#E6C766] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add to Cart
          </button>
        </div>

        {full_description ? (
          <div className="mt-6 rounded-3xl border border-[#2b2b2b] bg-[#0A0A0A]/80 p-6">
            <h2 className="mb-4 text-xl font-semibold text-white">
              Product Details
            </h2>
            <div className="prose-custom">
              <p>{full_description}</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}