import Link from "next/link"

export default function StoreFooter() {
  return (
    <footer className="relative mt-20 overflow-hidden border-t border-white/10 bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.10),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.05),transparent_18%),linear-gradient(180deg,#050505_0%,#000000_100%)]" />
      <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(2px_2px_at_20px_30px,rgba(255,255,255,0.95),transparent),radial-gradient(1.5px_1.5px_at_120px_80px,rgba(255,255,255,0.75),transparent),radial-gradient(1.8px_1.8px_at_220px_160px,rgba(255,255,255,0.85),transparent),radial-gradient(1.2px_1.2px_at_320px_40px,rgba(255,255,255,0.75),transparent),radial-gradient(2px_2px_at_420px_220px,rgba(212,175,55,0.55),transparent),radial-gradient(1.5px_1.5px_at_540px_110px,rgba(255,255,255,0.70),transparent),radial-gradient(1.8px_1.8px_at_680px_260px,rgba(212,175,55,0.35),transparent)]" />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.9fr_0.9fr]">
          {/* SHAHEEN BOX */}
          <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/5 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.18),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))]" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-full bg-[#D4AF37]/20 blur-xl" />
                <img
                  src="/shaheen.jpeg"
                  alt="Shaheen Safi"
                  className="relative h-24 w-24 rounded-full border-2 border-[#D4AF37]/40 object-cover shadow-[0_0_28px_rgba(212,175,55,0.18)]"
                />
              </div>

              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">
                  Founder Spotlight
                </div>
                <h3 className="mt-2 text-2xl font-bold text-white">
                  Shaheen Safi
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-7 text-gray-300">
                  Shaheen Safi is the driving force behind SafiPro, combining
                  strong vision, digital business thinking, technical knowledge,
                  design awareness, and a deep passion for building modern
                  brands with international standards. His focus is not only on
                  creating a store, but on shaping a complete premium identity
                  that feels powerful, trusted, and future-ready.
                </p>
              </div>
            </div>
          </div>

          {/* BRAND */}
          <div className="rounded-[30px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">
              SafiPro
            </div>
            <h3 className="mt-3 text-2xl font-bold text-white">
              Premium Fashion Experience
            </h3>
            <p className="mt-4 text-sm leading-7 text-gray-400">
              SafiPro is built around luxury presentation, secure checkout, and
              a bold black-and-gold identity designed for customers who value
              style, quality, and strong brand energy.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-4 py-2 text-xs font-medium text-[#E6C766]">
                Luxury Design
              </span>
              <span className="rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-4 py-2 text-xs font-medium text-[#E6C766]">
                Secure Checkout
              </span>
              <span className="rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-4 py-2 text-xs font-medium text-[#E6C766]">
                Premium Storefront
              </span>
            </div>
          </div>

          {/* LINKS */}
          <div className="rounded-[30px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">
              Navigation
            </div>

            <div className="mt-5 flex flex-col gap-3 text-sm">
              <Link
                href="/"
                className="rounded-2xl border border-transparent px-3 py-2 text-gray-300 transition hover:border-white/10 hover:bg-white/5 hover:text-white"
              >
                Home
              </Link>

              <Link
                href="/shop"
                className="rounded-2xl border border-transparent px-3 py-2 text-gray-300 transition hover:border-white/10 hover:bg-white/5 hover:text-white"
              >
                Shop
              </Link>

              <Link
                href="/about"
                className="rounded-2xl border border-transparent px-3 py-2 text-gray-300 transition hover:border-white/10 hover:bg-white/5 hover:text-white"
              >
                About
              </Link>

              <Link
                href="/cart"
                className="rounded-2xl border border-transparent px-3 py-2 text-gray-300 transition hover:border-white/10 hover:bg-white/5 hover:text-white"
              >
                Cart
              </Link>

              <Link
                href="/checkout"
                className="rounded-2xl border border-transparent px-3 py-2 text-gray-300 transition hover:border-white/10 hover:bg-white/5 hover:text-white"
              >
                Checkout
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-gray-500 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} SafiPro. All rights reserved.</p>
          <p className="text-gray-600">
            Designed with a luxury identity for a modern premium storefront
          </p>
        </div>
      </div>
    </footer>
  )
}