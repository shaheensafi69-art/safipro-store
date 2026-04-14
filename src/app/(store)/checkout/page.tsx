"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { useCart } from "@/components/cart/cart-provider"

const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
]

export default function CheckoutPage() {
  const { items, subtotal, itemCount } = useCart()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "United States",
    state: "",
    city: "",
    address: "",
    address2: "",
    postal: "",
  })

  const shipping = useMemo(() => {
  if (items.length === 0) return 0
  return 2.5
}, [items.length])

  const total = useMemo(() => subtotal + shipping, [subtotal, shipping])

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
    if (!form.phone.trim()) return "Phone number is required"
    if (!form.country.trim()) return "Country is required"
    if (!form.state.trim()) return "State is required"
    if (!form.city.trim()) return "City is required"
    if (!form.address.trim()) return "Address is required"
    if (!form.postal.trim()) return "ZIP code is required"
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
          state: form.state,
          city: form.city,
          addressLine1: form.address,
          addressLine2: form.address2,
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
        <div className="rounded-[32px] border border-[#2b2b2b] bg-[#0A0A0A]/90 p-10 text-center shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
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
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-[32px] border border-[#2b2b2b] bg-[#0A0A0A]/90 px-6 py-8 shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
        <div className="inline-flex rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#E6C766]">
          Secure Checkout
        </div>

        <h1 className="mt-4 text-4xl font-bold text-white">
          Complete Your <span className="text-[#D4AF37]">Order</span>
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-300 sm:text-base">
          Enter your shipping details and continue to secure card payment.
        </p>
      </div>

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
          <div className="rounded-[30px] border border-[#2b2b2b] bg-[#0A0A0A]/90 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
            <h2 className="mb-5 text-xl font-semibold text-white">
              Contact information
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  First name
                </label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  className="input"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Last name
                </label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  className="input"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Email address
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="input"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Phone number
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="input"
                />
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-[#2b2b2b] bg-[#0A0A0A]/90 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
            <h2 className="mb-5 text-xl font-semibold text-white">
              Shipping address
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Country / Region
                </label>
                <select
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="United States">United States</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  State
                </label>
                <select
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Select state</option>
                  {US_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Street address
                </label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Street address"
                  className="input"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Apartment, suite, etc.
                </label>
                <input
                  name="address2"
                  value={form.address2}
                  onChange={handleChange}
                  placeholder="Apartment, suite, unit, building, floor, etc."
                  className="input"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  City
                </label>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="input"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  ZIP code
                </label>
                <input
                  name="postal"
                  value={form.postal}
                  onChange={handleChange}
                  placeholder="ZIP code"
                  className="input"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[30px] border border-[#2b2b2b] bg-[#0A0A0A]/90 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.25)] lg:sticky lg:top-24 lg:h-fit">
          <h2 className="text-xl font-semibold text-white">Order Summary</h2>

          <div className="mt-5 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 rounded-2xl border border-[#2b2b2b] bg-black/30 p-3"
              >
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-[#111111]">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-contain"
                    />
                  ) : null}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-2 text-sm font-semibold text-white">
                    {item.title}
                  </h3>

                  <div className="mt-2 space-y-1 text-xs text-gray-400">
                    {item.color ? <p>Color: {item.color}</p> : null}
                    {item.size ? <p>Size: {item.size}</p> : null}
                    <p>Qty: {item.quantity}</p>
                  </div>
                </div>

                <div className="text-right text-sm font-bold text-[#D4AF37]">
                  {(item.price * item.quantity).toFixed(2)} {item.currency}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3 border-t border-[#2b2b2b] pt-6 text-sm text-gray-300">
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

            <div className="flex justify-between border-t border-[#2b2b2b] pt-4 text-base font-bold text-[#D4AF37]">
              <span>Total</span>
              <span>{total.toFixed(2)} USD</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleStripe}
            disabled={loading}
            className="mt-6 w-full rounded-2xl bg-[#D4AF37] py-3 font-bold text-black transition hover:bg-[#E6C766] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Processing..." : "Pay with Card"}
          </button>
        </div>
      </div>

      <style jsx>{`
        .input {
          background: #0a0a0a;
          border: 1px solid #2b2b2b;
          padding: 12px 14px;
          border-radius: 14px;
          color: white;
          width: 100%;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .input:focus {
          border-color: rgba(212, 175, 55, 0.45);
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.08);
        }

        .input::placeholder {
          color: #6b7280;
        }

        select.input {
          appearance: none;
        }
      `}</style>
    </main>
  )
}