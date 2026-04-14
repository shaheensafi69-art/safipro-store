"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/components/cart/cart-provider"

type AddToCartButtonProps = {
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
  disabled?: boolean
}

export default function AddToCartButton({
  productId,
  variantId,
  title,
  slug,
  image,
  size,
  color,
  sku,
  price,
  currency,
  disabled,
}: AddToCartButtonProps) {
  const { addItem } = useCart()
  const router = useRouter()
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    if (disabled) return

    addItem({
      id: `${productId}_${variantId}`,
      productId,
      variantId,
      title,
      slug,
      image,
      size,
      color,
      sku,
      price,
      currency,
    })

    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <div className="mt-2 space-y-3">
      <button
        type="button"
        onClick={handleAdd}
        disabled={disabled}
        className="w-full rounded-2xl bg-[#D4AF37] px-4 py-3 font-semibold text-black transition hover:bg-[#E6C766] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {added ? "Added to Cart" : "Add to Cart"}
      </button>

      <button
        type="button"
        onClick={() => router.push("/cart")}
        className="w-full rounded-2xl border border-[#2b2b2b] bg-black/30 px-4 py-3 font-semibold text-white transition hover:border-[#D4AF37]/40"
      >
        Go to Cart
      </button>
    </div>
  )
}