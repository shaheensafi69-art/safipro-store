import Link from "next/link"

const highlights = [
  {
    title: "Premium Identity",
    text: "SafiPro is built around a luxury visual language with strong contrast, clean product focus, and a refined storefront experience.",
  },
  {
    title: "Modern Commerce",
    text: "From product sync to secure checkout, the brand is designed to feel modern, fast, and ready for international standards.",
  },
  {
    title: "Future Vision",
    text: "The goal is not only to sell products, but to build a memorable premium fashion presence with long-term brand value.",
  },
]

const values = [
  "Luxury presentation",
  "Strong brand identity",
  "Secure shopping experience",
  "Modern digital commerce",
  "Premium customer journey",
  "Global growth mindset",
]

export default function AboutPage() {
  return (
    <main className="bg-black text-white">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.16),transparent_25%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.06),transparent_18%),linear-gradient(180deg,#050505_0%,#000000_100%)]" />
        <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(2px_2px_at_20px_30px,rgba(255,255,255,0.95),transparent),radial-gradient(1.5px_1.5px_at_120px_80px,rgba(255,255,255,0.75),transparent),radial-gradient(1.8px_1.8px_at_220px_160px,rgba(255,255,255,0.85),transparent),radial-gradient(1.2px_1.2px_at_320px_40px,rgba(255,255,255,0.75),transparent),radial-gradient(2px_2px_at_420px_220px,rgba(212,175,55,0.45),transparent),radial-gradient(1.5px_1.5px_at_540px_110px,rgba(255,255,255,0.70),transparent),radial-gradient(1.8px_1.8px_at_680px_260px,rgba(212,175,55,0.35),transparent)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="inline-flex rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#E6C766]">
              About SafiPro
            </div>

            <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-7xl">
              Built to feel
              <span className="block text-[#D4AF37]">premium, bold, and unforgettable</span>
            </h1>

            <p className="mt-6 max-w-3xl text-sm leading-8 text-gray-300 sm:text-base">
              SafiPro is a modern premium fashion brand shaped around strong
              visual identity, elevated presentation, and a storefront
              experience designed to feel luxurious from the first second. It is
              built for people who value design, confidence, and future-focused
              style.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="rounded-2xl bg-[#D4AF37] px-6 py-3 font-semibold text-black transition hover:bg-[#E6C766]"
              >
                Explore the Shop
              </Link>

              <Link
                href="/"
                className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white transition hover:border-[#D4AF37]/35 hover:bg-white/10"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* BRAND STORY */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">
              Brand Story
            </div>
            <h2 className="mt-3 text-3xl font-bold text-white">
              More than a store, a complete luxury direction
            </h2>
            <p className="mt-5 text-sm leading-8 text-gray-300">
              SafiPro was created with the idea that a brand should feel
              intentional in every detail. From visual tone to product
              presentation, from checkout flow to storefront structure, the goal
              is to create an experience that reflects confidence, quality, and
              premium thinking.
            </p>
            <p className="mt-4 text-sm leading-8 text-gray-300">
              This is why the brand carries a bold black and gold identity,
              combines fashion with modern digital commerce, and focuses on
              building a lasting name rather than just listing products online.
            </p>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(212,175,55,0.10),rgba(255,255,255,0.03),rgba(0,0,0,0.10))] p-8 backdrop-blur-xl">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">
              Core Direction
            </div>
            <div className="mt-6 space-y-5">
              {highlights.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-black/30 p-5"
                >
                  <h3 className="text-lg font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-gray-400">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[34px] border border-white/10 bg-white/5 p-8 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:items-center">
            <div className="flex justify-center lg:justify-start">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-[#D4AF37]/20 blur-2xl" />
                <div className="relative rounded-full border border-[#D4AF37]/30 p-2">
                  <img
                    src="/shaheen.jpeg"
                    alt="Shaheen Safi"
                    className="h-52 w-52 rounded-full object-cover border border-white/10 shadow-[0_0_28px_rgba(212,175,55,0.18)]"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">
                Founder
              </div>
              <h2 className="mt-3 text-3xl font-bold text-white">
                Shaheen Safi
              </h2>
              <p className="mt-5 text-sm leading-8 text-gray-300">
                Shaheen Safi is the founder and strategic force behind SafiPro.
                His direction combines business vision, digital product
                thinking, design sensitivity, branding discipline, and a serious
                ambition to build projects that feel modern, scalable, and
                internationally relevant.
              </p>
              <p className="mt-4 text-sm leading-8 text-gray-300">
                He approaches SafiPro not simply as an online store, but as a
                premium brand experience. The focus is on quality presentation,
                structured growth, and creating a storefront that reflects power,
                taste, and long-term brand value.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-[34px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl lg:p-10">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">
            Brand Values
          </div>
          <h2 className="mt-3 text-3xl font-bold text-white">
            What defines SafiPro
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value) => (
              <div
                key={value}
                className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-sm font-medium text-gray-200"
              >
                {value}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(135deg,rgba(212,175,55,0.14),rgba(255,255,255,0.04),rgba(0,0,0,0.20))] p-10 text-center shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">
            Ready to Explore
          </div>
          <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
            Step into the SafiPro collection
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-gray-300">
            Discover products presented with a premium identity, secure
            checkout, and a storefront built to feel strong, refined, and
            memorable.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/shop"
              className="rounded-2xl bg-[#D4AF37] px-7 py-3 font-semibold text-black transition hover:bg-[#E6C766]"
            >
              Go to Shop
            </Link>

            <Link
              href="/cart"
              className="rounded-2xl border border-white/10 bg-white/5 px-7 py-3 font-semibold text-white transition hover:border-[#D4AF37]/35 hover:bg-white/10"
            >
              View Cart
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}