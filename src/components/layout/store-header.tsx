"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCart } from "@/components/cart/cart-provider"

const navItems = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
]

export default function StoreHeader() {
  const pathname = usePathname()
  const { itemCount } = useCart()

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/55 to-transparent pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-black/35 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.16),transparent_26%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_18%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
          <div className="absolute -left-10 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-[#D4AF37]/10 blur-3xl" />
          <div className="absolute -right-10 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-white/5 blur-3xl" />

          <div className="relative flex items-center justify-between gap-4 px-4 py-3 sm:px-5 lg:px-6">
            <Link href="/" className="group flex min-w-0 items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-[#D4AF37]/25 blur-md transition duration-300 group-hover:bg-[#D4AF37]/35" />
                <img
                  src="/logo.jpeg"
                  alt="SafiPro"
                  className="relative h-11 w-11 rounded-full border border-white/10 object-cover shadow-[0_0_18px_rgba(212,175,55,0.16)]"
                />
              </div>

              <div className="min-w-0">
                <div className="truncate text-lg font-bold tracking-[0.22em] text-[#D4AF37]">
                  SAFIPRO
                </div>
                <div className="mt-0.5 truncate text-[10px] uppercase tracking-[0.28em] text-gray-400">
                  Luxury Storefront
                </div>
              </div>
            </Link>

            <nav className="hidden lg:block">
              <div className="flex items-center rounded-full border border-white/10 bg-white/5 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                {navItems.map((item) => {
                  const active =
                    item.href === "/"
                      ? pathname === item.href
                      : pathname?.startsWith(item.href)

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`relative rounded-full px-5 py-2.5 text-sm font-medium transition ${
                        active
                          ? "bg-[#D4AF37] text-black shadow-[0_8px_22px_rgba(212,175,55,0.28)]"
                          : "text-white hover:bg-white/8 hover:text-[#F1D67A]"
                      }`}
                    >
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/shop"
                className="hidden sm:inline-flex items-center rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/12 px-4 py-2.5 text-sm font-semibold text-[#E6C766] transition hover:border-[#D4AF37]/45 hover:bg-[#D4AF37]/18"
              >
                Explore
              </Link>

              <Link
                href="/cart"
                aria-label="Shopping cart"
                className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-[#D4AF37]/35 hover:bg-[#D4AF37]/10 hover:text-[#F1D67A]"
              >
                <span className="absolute inset-0 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]" />

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="relative h-5 w-5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="20" r="1" />
                  <circle cx="18" cy="20" r="1" />
                  <path d="M3 4h2l2.2 10.2a1 1 0 0 0 1 .8H19a1 1 0 0 0 1-.8L21 7H7" />
                </svg>

                {itemCount > 0 ? (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full border border-black/10 bg-[#D4AF37] px-1 text-[10px] font-bold text-black shadow-[0_6px_18px_rgba(212,175,55,0.35)]">
                    {itemCount}
                  </span>
                ) : null}
              </Link>
            </div>
          </div>

          <div className="border-t border-white/6 px-4 py-2 lg:hidden">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {navItems.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === item.href
                    : pathname?.startsWith(item.href)

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                      active
                        ? "bg-[#D4AF37] text-black"
                        : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}