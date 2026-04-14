import Link from "next/link"
import { createAdminClient } from "@/lib/supabase/admin"

type Product = {
  id: string
  title: string
  slug: string
}

type ProductImage = {
  image_url: string
  is_primary: boolean
}

type ProductVariant = {
  selling_price: number
  currency: string
  is_available: boolean
}

type ProductRow = Product & {
  product_images: ProductImage[]
  product_variants: ProductVariant[]
}

export default async function HomePage() {
  const supabase = createAdminClient()

  const { data } = await supabase
    .from("products")
    .select(`
      id,
      title,
      slug,
      product_images (
        image_url,
        is_primary
      ),
      product_variants (
        selling_price,
        currency,
        is_available
      )
    `)
    .eq("status", "active")
    .eq("visible", true)
    .limit(6)

  const products = (data || []) as ProductRow[]

  return (
    <main className="relative overflow-hidden bg-black text-white">
      {/* Galaxy Background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-black" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(212,175,55,0.12),transparent_28%),radial-gradient(circle_at_85%_30%,rgba(255,255,255,0.06),transparent_18%),radial-gradient(circle_at_50%_80%,rgba(212,175,55,0.08),transparent_22%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-40 bg-[radial-gradient(2px_2px_at_20px_30px,rgba(255,255,255,0.9),transparent),radial-gradient(1.5px_1.5px_at_140px_90px,rgba(255,255,255,0.75),transparent),radial-gradient(2px_2px_at_260px_160px,rgba(212,175,55,0.55),transparent),radial-gradient(1.5px_1.5px_at_400px_60px,rgba(255,255,255,0.7),transparent),radial-gradient(2px_2px_at_520px_240px,rgba(212,175,55,0.35),transparent),radial-gradient(1.5px_1.5px_at_680px_120px,rgba(255,255,255,0.8),transparent)]" />

      {/* HERO */}
      <section className="relative flex h-[82vh] min-h-[620px] items-end overflow-hidden sm:h-[90vh]">
        <img
          src="/hero.jpeg"
          alt="SafiPro Hero"
          className="absolute inset-0 h-full w-full object-cover object-center sm:object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/45 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.12),transparent_55%)]" />

        <div className="relative mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 sm:pb-14 lg:px-8 lg:pb-16">
          <div className="max-w-2xl rounded-[28px] border border-white/10 bg-black/25 p-5 backdrop-blur-md sm:p-7">
            <div className="inline-flex rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E6C766]">
              Luxury Streetwear
            </div>

            <h1 className="mt-5 text-4xl font-bold tracking-[0.18em] text-[#D4AF37] sm:text-5xl lg:text-6xl">
              SAFIPRO
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-gray-300 sm:text-base">
              Built for leaders who refuse average. Power, vision and identity
              shaped into premium design.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="rounded-full bg-[#D4AF37] px-7 py-3 font-semibold text-black transition hover:bg-[#E6C766]"
              >
                Shop Now
              </Link>

              <Link
                href="/about"
                className="rounded-full border border-white/15 bg-white/5 px-7 py-3 font-semibold text-white transition hover:border-[#D4AF37]/35 hover:bg-white/10"
              >
                About Brand
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SIGNATURE SHOWCASE */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#D4AF37]">
            Signature Showcase
          </div>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            Designed to feel powerful
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
            Selected pieces that represent the direction of SafiPro with clean
            visuals, strong symbolism and premium identity.
          </p>
        </div>

        <div className="space-y-20">
          {/* T-SHIRT */}
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#0A0A0A]/70 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
              <img
                src="/t-shirt.jpeg"
                alt="Own Your Future T-Shirt"
                className="h-[420px] w-full object-cover object-center sm:h-[520px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>

            <div className="rounded-[32px] border border-white/10 bg-[#0A0A0A]/60 p-7 backdrop-blur-xl">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">
                Featured Apparel
              </div>

              <h3 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                Own Your Future T-Shirt
              </h3>

              <p className="mt-5 text-sm leading-8 text-gray-300 sm:text-base">
                This piece is created for people who move with intention. The
                “Own Your Future” design represents discipline, ambition and a
                mindset that refuses to settle for average. Clean, confident and
                bold, it is built to feel premium both in message and presence.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-gray-200">
                  Premium cotton feel
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-gray-200">
                  Strong eagle artwork
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-gray-200">
                  Leadership aesthetic
                </div>
              </div>

              <div className="mt-7">
                <Link
                  href="/shop"
                  className="inline-flex rounded-full bg-[#D4AF37] px-7 py-3 font-semibold text-black transition hover:bg-[#E6C766]"
                >
                  Explore Collection
                </Link>
              </div>
            </div>
          </div>

          {/* MUG */}
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="order-2 rounded-[32px] border border-white/10 bg-[#0A0A0A]/60 p-7 backdrop-blur-xl lg:order-1">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">
                Featured Drinkware
              </div>

              <h3 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                CEO Vision Mug
              </h3>

              <p className="mt-5 text-sm leading-8 text-gray-300 sm:text-base">
                Every day starts with mindset. This mug is made for builders,
                thinkers and decision-makers who want a daily reminder of focus,
                authority and clear vision. The eagle face and CEO mark turn a
                simple product into a symbol of purpose.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-gray-200">
                  Premium ceramic build
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-gray-200">
                  Strong visual identity
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-gray-200">
                  CEO mindset energy
                </div>
              </div>

              <div className="mt-7">
                <Link
                  href="/shop"
                  className="inline-flex rounded-full border border-[#D4AF37] px-7 py-3 font-semibold text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-black"
                >
                  View Products
                </Link>
              </div>
            </div>

            <div className="order-1 relative overflow-hidden rounded-[32px] border border-white/10 bg-[#0A0A0A]/70 shadow-[0_10px_40px_rgba(0,0,0,0.35)] lg:order-2">
              <img
                src="/gg.jpeg"
                alt="CEO Vision Mug"
                className="h-[420px] w-full object-cover object-center sm:h-[520px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS FROM DATABASE */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#D4AF37]">
              Live Products
            </div>
            <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
              Featured Products
            </h2>
          </div>

          <Link
            href="/shop"
            className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-[#D4AF37]/35 hover:text-[#E6C766]"
          >
            View All
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => {
            const image =
              product.product_images?.find((i) => i.is_primary) ||
              product.product_images?.[0]

            const variant =
              product.product_variants?.find((v) => v.is_available) ||
              product.product_variants?.[0]

            return (
              <Link
                key={product.id}
                href={`/shop/${product.slug}`}
                className="group overflow-hidden rounded-[30px] border border-[#2b2b2b] bg-[#0A0A0A]/90 transition duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/40 hover:shadow-[0_0_30px_rgba(212,175,55,0.14)]"
              >
                <div className="relative aspect-square overflow-hidden bg-black">
                  {image?.image_url ? (
                    <img
                      src={image.image_url}
                      alt={product.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-500">
                      No image
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                <div className="p-5">
                  <h3 className="line-clamp-2 text-lg font-semibold text-white">
                    {product.title}
                  </h3>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-lg font-bold text-[#D4AF37]">
                      {variant
                        ? `${variant.selling_price} ${variant.currency}`
                        : "—"}
                    </div>

                    <span className="rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-3 py-1 text-xs font-medium text-[#E6C766]">
                      Premium
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* WHY SAFIPRO */}
      <section className="bg-[#0A0A0A]/75 py-20 text-center backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#D4AF37]">
            Why SafiPro
          </div>

          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            More than products
          </h2>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            <div className="rounded-[28px] border border-[#2b2b2b] bg-black/40 p-6">
              <h3 className="text-xl font-semibold text-white">
                Premium Quality
              </h3>
              <p className="mt-3 text-sm leading-7 text-gray-400">
                High-end products designed to feel clean, strong and lasting.
              </p>
            </div>

            <div className="rounded-[28px] border border-[#2b2b2b] bg-black/40 p-6">
              <h3 className="text-xl font-semibold text-white">
                Strong Identity
              </h3>
              <p className="mt-3 text-sm leading-7 text-gray-400">
                Visuals and messaging built around leadership, focus and power.
              </p>
            </div>

            <div className="rounded-[28px] border border-[#2b2b2b] bg-black/40 p-6">
              <h3 className="text-xl font-semibold text-white">
                Secure Checkout
              </h3>
              <p className="mt-3 text-sm leading-7 text-gray-400">
                Smooth and secure buying experience with trusted payment flow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-24 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[#D4AF37] sm:text-4xl">
          Ready to elevate your style?
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
          Step into a collection designed with identity, confidence and premium
          energy.
        </p>

        <Link
          href="/shop"
          className="mt-8 inline-block rounded-full border border-[#D4AF37] px-8 py-4 font-semibold text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-black"
        >
          Explore Full Collection
        </Link>
      </section>
    </main>
  )
}