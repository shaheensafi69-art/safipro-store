"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { useCart } from "@/components/cart/cart-provider"
import { PayPalButtons } from "@paypal/react-paypal-js"

export default function CheckoutPage() {
  const { items, subtotal, itemCount, clearCart } = useCart()

  const [loading, setLoading] = useState(false)
  const [paypalLoading, setPaypalLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    address: "",
    postal: "",
  })

  const shipping = useMemo(() => {
    if (items.length === 0) return 0
    if (subtotal >= 100) return 0
    return 9.99
  }, [items.length, subtotal])

  const total = useMemo(() => subtotal + shipping, [subtotal, shipping])

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (error) setError("")
  }

  function validate() {
    if (!items.length) return "Your cart is empty"
    if (!form.firstName.trim()) return "First name is required"
    if (!form.lastName.trim()) return "Last name is required"
    if (!form.email.trim()) return "Email is required"
    if (!form.country.trim()) return "Country is required"
    if (!form.city.trim()) return "City is required"
    if (!form.address.trim()) return "Address is required"
    return null
  }

  async function createOrder() {
    const res = await fetch("/api/orders/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
        },
        shippingAddress: {
          country: form.country,
          city: form.city,
          addressLine1: form.address,
          postalCode: form.postal,
        },
        items,
        shippingCost: shipping,
      }),
    })

    const data = await res.json()

    if (!res.ok || !data.success) {
      throw new Error(data.error || "Failed to create order")
    }

    return data.order
  }

  async function handleStripe() {
    setError("")
    setSuccess("")

    const err = validate()
    if (err) {
      setError(err)
      return
    }

    try {
      setLoading(true)
      setSuccess("Creating order...")

      const order = await createOrder()

      const res = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: order.id,
          orderNumber: order.order_number,
          customerEmail: form.email,
          items,
          shippingCost: shipping,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.url) {
        throw new Error(data.error || "Stripe session creation failed")
      }

      setSuccess("Redirecting to Stripe...")
      window.location.href = data.url
    } catch (e) {
      setError(e instanceof Error ? e.message : "Stripe checkout failed")
      setSuccess("")
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-3xl border border-[#2b2b2b] bg-black p-8 text-center">
          <h1 className="text-3xl font-bold text-[#D4AF37]">Checkout</h1>
          <p className="mt-4 text-gray-300">
            Your cart is empty. Add some products before proceeding to checkout.
          </p>

          <Link
            href="/shop"
            className="mt-6 inline-block rounded-2xl bg-[#D4AF37] px-5 py-3 font-semibold text-black transition hover:bg-[#E6C766]"
          >
            Return to Shop
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-8 text-4xl font-bold text-[#D4AF37]">
        Secure Checkout
      </h1>

      {error ? (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-red-300">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="mb-4 rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-green-300">
          {success}
        </div>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-[#2b2b2b] bg-black p-6">
            <h2 className="mb-4 text-xl text-white">Customer Info</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="input"
              />

              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="input"
              />

              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="input sm:col-span-2"
              />

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="input sm:col-span-2"
              />
            </div>
          </div>

          <div className="rounded-3xl border border-[#2b2b2b] bg-black p-6">
            <h2 className="mb-4 text-xl text-white">Shipping</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <input
                name="country"
                value={form.country}
                onChange={handleChange}
                placeholder="Country"
                className="input"
              />

              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="City"
                className="input"
              />

              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Address"
                className="input sm:col-span-2"
              />

              <input
                name="postal"
                value={form.postal}
                onChange={handleChange}
                placeholder="Postal Code"
                className="input sm:col-span-2"
              />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-[#2b2b2b] bg-black p-6">
          <h2 className="text-xl text-white">Order Summary</h2>

          <div className="mt-4 space-y-2 text-sm text-gray-300">
            <div className="flex justify-between">
              <span>Items</span>
              <span>{itemCount}</span>
            </div>

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{subtotal.toFixed(2)} USD</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : `${shipping.toFixed(2)} USD`}</span>
            </div>

            <div className="flex justify-between border-t border-[#2b2b2b] pt-3 font-bold text-[#D4AF37]">
              <span>Total</span>
              <span>{total.toFixed(2)} USD</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleStripe}
            disabled={loading || paypalLoading}
            className="mt-6 w-full rounded-2xl bg-[#D4AF37] py-3 font-bold text-black transition hover:bg-[#E6C766] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Processing..." : "Pay with Card"}
          </button>

          <div className="mt-4">
            <PayPalButtons
              style={{ layout: "vertical", color: "gold" }}
              disabled={loading || paypalLoading}
              createOrder={async () => {
                setError("")
                setSuccess("")

                const err = validate()
                if (err) {
                  setError(err)
                  throw new Error(err)
                }

                try {
                  setPaypalLoading(true)
                  setSuccess("Creating PayPal order...")

                  await createOrder()

                  const res = await fetch("/api/paypal/create-order", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ total }),
                  })

                  const data = await res.json()

                  if (!res.ok || !data.orderID) {
                    throw new Error(data.error || "PayPal order creation failed")
                  }

                  return data.orderID
                } catch (e) {
                  const message =
                    e instanceof Error ? e.message : "PayPal checkout failed"
                  setError(message)
                  setSuccess("")
                  throw e
                } finally {
                  setPaypalLoading(false)
                }
              }}
              onApprove={async (data) => {
                try {
                  setPaypalLoading(true)
                  setError("")
                  setSuccess("Capturing PayPal payment...")

                  const res = await fetch("/api/paypal/capture-order", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ orderID: data.orderID }),
                  })

                  const result = await res.json()

                  if (!res.ok || !result.success) {
                    throw new Error(result.error || "PayPal capture failed")
                  }

                  clearCart()
                  window.location.href = "/order-success"
                } catch (e) {
                  setError(
                    e instanceof Error ? e.message : "PayPal payment failed"
                  )
                  setSuccess("")
                } finally {
                  setPaypalLoading(false)
                }
              }}
              onError={() => {
                setError("PayPal error occurred")
                setSuccess("")
                setPaypalLoading(false)
              }}
            />
          </div>

          <Link
            href="/cart"
            className="mt-4 block text-center text-gray-400 transition hover:text-white"
          >
            Back to Cart
          </Link>
        </div>
      </div>

      <style jsx>{`
        .input {
          background: #0a0a0a;
          border: 1px solid #2b2b2b;
          padding: 12px;
          border-radius: 12px;
          color: white;
          width: 100%;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .input:focus {
          border-color: rgba(212, 175, 55, 0.4);
        }

        .input::placeholder {
          color: #6b7280;
        }
      `}</style>
    </main>
  )
}