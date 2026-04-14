"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCart } from "@/components/cart/cart-provider"

export default function CartPage() {
  const { items, subtotal, itemCount, updateQuantity, removeItem, clearCart } =
    useCart()

  const router = useRouter()

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-3xl font-bold text-[#D4AF37]">Your Cart</h1>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-[#2b2b2b] bg-[#0A0A0A]/90 p-8 text-center">
          <p className="text-lg text-white">Your cart is empty</p>
          <Link
            href="/shop"
            className="mt-4 inline-block rounded-2xl bg-[#D4AF37] px-5 py-3 font-semibold text-black"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl border border-[#2b2b2b] bg-[#0A0A0A]/90 p-4"
              >
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-[#111111]">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-contain"
                      />
                    ) : null}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="line-clamp-2 text-lg font-semibold text-white">
                      {item.title}
                    </h2>

                    <div className="mt-2 space-y-1 text-sm text-gray-400">
                      {item.color ? <p>Color: {item.color}</p> : null}
                      {item.size ? <p>Size: {item.size}</p> : null}
                      {item.sku ? <p>SKU: {item.sku}</p> : null}
                    </div>

                    <div className="mt-3 text-lg font-bold text-[#D4AF37]">
                      {item.price.toFixed(2)} {item.currency}
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-3 sm:items-end">
                    <div className="flex items-center rounded-xl border border-[#2b2b2b]">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-2 text-white"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 text-white">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-2 text-white"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-sm text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="h-fit rounded-3xl border border-[#2b2b2b] bg-[#0A0A0A]/90 p-6">
            <h2 className="text-xl font-semibold text-white">Order Summary</h2>

            <div className="mt-4 space-y-3 text-sm text-gray-300">
              <div className="flex items-center justify-between">
                <span>Items</span>
                <span>{itemCount}</span>
              </div>

              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#D4AF37]">
                  {subtotal.toFixed(2)} USD
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push("/checkout")}
              className="mt-6 w-full rounded-2xl bg-[#D4AF37] px-4 py-3 font-semibold text-black transition hover:bg-[#E6C766]"
            >
              Checkout
            </button>

            <button
              type="button"
              onClick={clearCart}
              className="mt-3 w-full rounded-2xl border border-[#2b2b2b] px-4 py-3 font-semibold text-white transition hover:border-red-500/40"
            >
              Clear Cart
            </button>
          </div>
        </div>
      )}
    </main>
  )
}