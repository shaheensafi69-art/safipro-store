"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useCart } from "@/components/cart/cart-provider"

type OrderItem = {
  id: string
  title_snapshot: string
  variant_snapshot: string | null
  image_snapshot: string | null
  quantity: number
  unit_price: number
  line_total: number
}

type OrderData = {
  id: string
  order_number: string
  customer_email: string
  customer_name: string | null
  total_amount: number
  subtotal: number
  shipping_cost: number
  payment_status: string
  fulfillment_status: string
  created_at: string
  order_items: OrderItem[]
}

export default function OrderSuccessClient() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const paypal = searchParams.get("paypal")
  const { clearCart } = useCart()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [order, setOrder] = useState<OrderData | null>(null)

  useEffect(() => {
    async function loadOrder() {
      try {
        if (paypal === "1") {
          clearCart()
          setLoading(false)
          return
        }

        if (!sessionId) {
          setError("Missing session id")
          setLoading(false)
          return
        }

        const res = await fetch(
          `/api/checkout/session-status?session_id=${encodeURIComponent(sessionId)}`,
          {
            method: "GET",
            cache: "no-store",
          }
        )

        const data = await res.json()

        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to load order")
        }

        setOrder(data.order)
        clearCart()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load order")
      } finally {
        setLoading(false)
      }
    }

    loadOrder()
  }, [sessionId, paypal, clearCart])

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-[#2b2b2b] bg-[#0A0A0A]/90 p-10 text-white shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
          Loading your order...
        </div>
      </main>
    )
  }

  if (paypal === "1" && !order) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-[32px] border border-[#2b2b2b] bg-[#0A0A0A]/90 px-6 py-8 shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
          <div className="inline-flex rounded-full border border-green-500/25 bg-green-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-green-300">
            Payment Successful
          </div>

          <h1 className="mt-4 text-4xl font-bold text-white">
            Thank you for your <span className="text-[#D4AF37]">order</span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-300 sm:text-base">
            Your PayPal payment was completed successfully.
          </p>

          <Link
            href="/shop"
            className="mt-6 inline-block rounded-2xl bg-[#D4AF37] px-5 py-3 font-semibold text-black transition hover:bg-[#E6C766]"
          >
            Continue Shopping
          </Link>
        </section>
      </main>
    )
  }

  if (error || !order) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-red-500/30 bg-red-500/10 p-8 text-red-300 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
          {error || "Order not found"}
        </div>

        <div className="mt-6">
          <Link
            href="/shop"
            className="inline-flex rounded-2xl bg-[#D4AF37] px-5 py-3 font-semibold text-black transition hover:bg-[#E6C766]"
          >
            Return to Shop
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-[32px] border border-[#2b2b2b] bg-[#0A0A0A]/90 px-6 py-8 shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
        <div className="inline-flex rounded-full border border-green-500/25 bg-green-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-green-300">
          Payment Successful
        </div>

        <h1 className="mt-4 text-4xl font-bold text-white">
          Thank you for your <span className="text-[#D4AF37]">order</span>
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-300 sm:text-base">
          Your payment was completed successfully. Your order has been received
          and is now being processed.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#2b2b2b] bg-black/30 p-4">
            <div className="text-xs uppercase tracking-[0.18em] text-gray-500">
              Order Number
            </div>
            <div className="mt-2 text-lg font-bold text-[#D4AF37]">
              {order.order_number}
            </div>
          </div>

          <div className="rounded-2xl border border-[#2b2b2b] bg-black/30 p-4">
            <div className="text-xs uppercase tracking-[0.18em] text-gray-500">
              Payment Status
            </div>
            <div className="mt-2 text-lg font-bold text-white">
              {order.payment_status}
            </div>
          </div>

          <div className="rounded-2xl border border-[#2b2b2b] bg-black/30 p-4">
            <div className="text-xs uppercase tracking-[0.18em] text-gray-500">
              Total
            </div>
            <div className="mt-2 text-lg font-bold text-[#D4AF37]">
              {order.total_amount.toFixed(2)} USD
            </div>
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <section className="rounded-[28px] border border-[#2b2b2b] bg-[#0A0A0A]/90 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
          <h2 className="text-2xl font-semibold text-white">Order Items</h2>

          <div className="mt-6 space-y-4">
            {order.order_items?.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 rounded-2xl border border-[#2b2b2b] bg-black/30 p-4"
              >
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-[#111111]">
                  {item.image_snapshot ? (
                    <img
                      src={item.image_snapshot}
                      alt={item.title_snapshot}
                      className="h-full w-full object-contain"
                    />
                  ) : null}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-2 text-base font-semibold text-white">
                    {item.title_snapshot}
                  </h3>

                  {item.variant_snapshot ? (
                    <p className="mt-2 text-sm text-gray-400">
                      {item.variant_snapshot}
                    </p>
                  ) : null}

                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-400">
                    <span>Qty: {item.quantity}</span>
                    <span>Unit: {item.unit_price.toFixed(2)} USD</span>
                  </div>
                </div>

                <div className="text-right text-sm font-bold text-[#D4AF37]">
                  {item.line_total.toFixed(2)} USD
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="h-fit rounded-[28px] border border-[#2b2b2b] bg-[#0A0A0A]/90 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.25)] lg:sticky lg:top-6">
          <h2 className="text-2xl font-semibold text-white">Summary</h2>

          <div className="mt-6 space-y-3 text-sm">
            <div className="flex items-center justify-between text-gray-300">
              <span>Customer</span>
              <span className="text-right">{order.customer_name || "Guest"}</span>
            </div>

            <div className="flex items-center justify-between text-gray-300">
              <span>Email</span>
              <span className="text-right">{order.customer_email}</span>
            </div>

            <div className="flex items-center justify-between text-gray-300">
              <span>Subtotal</span>
              <span>{order.subtotal.toFixed(2)} USD</span>
            </div>

            <div className="flex items-center justify-between text-gray-300">
              <span>Shipping</span>
              <span>{order.shipping_cost.toFixed(2)} USD</span>
            </div>

            <div className="flex items-center justify-between border-t border-[#2b2b2b] pt-4 text-base font-semibold text-white">
              <span>Total</span>
              <span className="text-[#D4AF37]">
                {order.total_amount.toFixed(2)} USD
              </span>
            </div>
          </div>

          <Link
            href="/shop"
            className="mt-6 block w-full rounded-2xl bg-[#D4AF37] px-4 py-3 text-center font-semibold text-black transition hover:bg-[#E6C766]"
          >
            Continue Shopping
          </Link>
        </aside>
      </div>
    </main>
  )
}