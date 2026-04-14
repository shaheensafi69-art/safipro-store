import { Suspense } from "react"
import OrderSuccessClient from "./order-success-client"

function OrderSuccessFallback() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-[32px] border border-[#2b2b2b] bg-[#0A0A0A]/90 p-10 text-white shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
        Loading your order...
      </div>
    </main>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<OrderSuccessFallback />}>
      <OrderSuccessClient />
    </Suspense>
  )
}