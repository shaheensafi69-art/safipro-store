import Link from "next/link"
import { createAdminClient } from "@/lib/supabase/admin"

type Product = {
  id: string
  title: string
  slug: string
  short_description: string | null
}

type ProductImage = {
  image_url: string
  is_primary: boolean
  sort_order?: number
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

function formatPrice(price: number | null, currency: string) {
  if (price === null) return "Price unavailable"
  return `${price.toFixed(2)} ${currency}`
}

export default async function HomePage() {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      title,
      slug,
      short_description,
      product_images (
        image_url,
        is_primary,
        sort_order
      ),
      product_variants (
        selling_price,
        currency,
        is_available
      )
    `)
    .eq("status", "active")
    .eq("visible", true)
    .order("created_at", { ascending: false })
    .limit(8)

  const products = (data || []) as ProductRow[]

  return (
    <main className="bg-black text-white">
      {/* HERO */}
      <section className="relative min-h-[88vh] overflow-hidden">
        <img
          src="/hero.jpeg"
          alt="SafiPro Hero"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.18),transparent_38%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black" />

        <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#E6C766]">
              SafiPro Luxury Collection
            </div>

            <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-7xl">
              Premium Fashion With a
              <span className="block text-[#D4AF37]">Bold Luxury Identity</span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-gray-300 sm:text-base">
              SafiPro brings modern premium style, powerful design language, and
              a refined black and gold storefront experience for customers who
              want more than ordinary fashion.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="rounded-2xl bg-[#D4AF37] px-6 py-3 font-semibold text-black transition hover:bg-[#E6C766]"
              >
                Shop Now
              </Link>

              <Link
                href="/shop"
                className="rounded-2xl border border-white/20 bg-white/5 px-6 py-3 font-semibold text-white transition hover:border-[#D4AF37]/40 hover:bg-white/10"
              >
                Explore Collection
              </Link>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-4">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4 backdrop-blur-sm">
                <div className="text-xs uppercase tracking-[0.18em] text-gray-400">
                  Store Style
                </div>
                <div className="mt-1 text-lg font-bold text-[#D4AF37]">
                  Luxury
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-4 backdrop-blur-sm">
                <div className="text-xs uppercase tracking-[0.18em] text-gray-400">
                  Checkout
                </div>
                <div className="mt-1 text-lg font-bold text-white">Secure</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-4 backdrop-blur-sm">
                <div className="text-xs uppercase tracking-[0.18em] text-gray-400">
                  Products
                </div>
                <div className="mt-1 text-lg font-bold text-white">
                  {products.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">
              Featured Products
            </div>
            <h2 className="mt-2 text-3xl font-bold text-white">
              Discover the SafiPro Collection
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-400">
              Real products synced from your store are displayed here. Customers
              can browse them directly from the homepage.
            </p>
          </div>

          <Link
            href="/shop"
            className="rounded-2xl border border-[#2b2b2b] bg-[#0A0A0A] px-5 py-3 font-semibold text-white transition hover:border-[#D4AF37]/40 hover:text-[#E6C766]"
          >
            View All Products
          </Link>
        </div>

        {error ? (
          <div className="mt-8 rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-red-300">
            Failed to load homepage products: {error.message}
          </div>
        ) : products.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-[#2b2b2b] bg-[#0A0A0A]/90 p-10 text-center">
            <h3 className="text-2xl font-semibold text-white">No Products Yet</h3>
            <p className="mt-3 text-sm leading-7 text-gray-400">
              Once products are synced and published, they will appear here
              automatically.
            </p>

            <Link
              href="/shop"
              className="mt-6 inline-block rounded-2xl bg-[#D4AF37] px-5 py-3 font-semibold text-black transition hover:bg-[#E6C766]"
            >
              Go to Shop
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => {
              const primaryImage =
                product.product_images?.find((img) => img.is_primary) ||
                product.product_images?.[0]

              const firstVariant =
                product.product_variants?.find((variant) => variant.is_available) ||
                product.product_variants?.[0]

              const price = firstVariant?.selling_price ?? null
              const currency = firstVariant?.currency ?? "USD"
              const isAvailable = Boolean(firstVariant?.is_available)

              return (
                <Link
                  key={product.id}
                  href={`/shop/${product.slug}`}
                  className="group overflow-hidden rounded-[28px] border border-[#2b2b2b] bg-[#0A0A0A]/90 shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1.5 hover:border-[#D4AF37]/40 hover:shadow-[0_0_30px_rgba(212,175,55,0.16)]"
                >
                  <div className="relative aspect-[4/4.4] overflow-hidden bg-gradient-to-b from-[#111111] to-black">
                    {primaryImage?.image_url ? (
                      <img
                        src={primaryImage.image_url}
                        alt={product.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-gray-500">
                        No image available
                      </div>
                    )}

                    <div className="absolute left-4 top-4 flex items-center gap-2">
                      <span className="rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#E6C766]">
                        Premium
                      </span>

                      <span
                        className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${
                          isAvailable
                            ? "border-green-500/30 bg-green-500/10 text-green-300"
                            : "border-red-500/30 bg-red-500/10 text-red-300"
                        }`}
                      >
                        {isAvailable ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>

                  <div className="p-5">
                    <h3 className="line-clamp-2 text-lg font-semibold leading-7 text-white transition group-hover:text-[#F3D46A]">
                      {product.title}
                    </h3>

                    {product.short_description ? (
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-400">
                        {product.short_description}
                      </p>
                    ) : (
                      <p className="mt-3 text-sm leading-6 text-gray-500">
                        Premium product from the SafiPro collection.
                      </p>
                    )}

                    <div className="mt-6 flex items-end justify-between gap-4">
                      <div>
                        <div className="text-xs uppercase tracking-[0.18em] text-gray-500">
                          Price
                        </div>
                        <div className="mt-1 text-xl font-bold text-[#D4AF37]">
                          {formatPrice(price, currency)}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-[#2b2b2b] bg-black/30 px-4 py-2 text-sm font-medium text-white transition group-hover:border-[#D4AF37]/30 group-hover:text-[#E6C766]">
                        View
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      {/* BRAND BANNER */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[32px] border border-[#2b2b2b] bg-[linear-gradient(135deg,#0a0a0a_0%,#161616_60%,#101010_100%)] p-8 shadow-[0_12px_40px_rgba(0,0,0,0.35)] sm:p-12">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">
                Why SafiPro
              </div>
              <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                Built for premium presentation and serious brand identity
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
                SafiPro is not just another storefront. It is designed to feel
                elevated, polished, and memorable, with luxury styling, secure
                checkout, and a product experience built to convert.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <div className="rounded-2xl border border-[#2b2b2b] bg-black/30 px-5 py-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-gray-500">
                    Premium Design
                  </div>
                  <div className="mt-1 text-lg font-bold text-white">
                    Black & Gold
                  </div>
                </div>

                <div className="rounded-2xl border border-[#2b2b2b] bg-black/30 px-5 py-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-gray-500">
                    Payment
                  </div>
                  <div className="mt-1 text-lg font-bold text-white">
                    Stripe & PayPal
                  </div>
                </div>

                <div className="rounded-2xl border border-[#2b2b2b] bg-black/30 px-5 py-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-gray-500">
                    Fulfillment
                  </div>
                  <div className="mt-1 text-lg font-bold text-white">
                    Printify Ready
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-3xl border border-[#2b2b2b] bg-black/30 p-6">
                <h3 className="text-xl font-semibold text-[#D4AF37]">
                  Premium Quality
                </h3>
                <p className="mt-3 text-sm leading-6 text-gray-400">
                  Carefully selected products with strong presentation and clean
                  product detail experience.
                </p>
              </div>

              <div className="rounded-3xl border border-[#2b2b2b] bg-black/30 p-6">
                <h3 className="text-xl font-semibold text-[#D4AF37]">
                  Secure Checkout
                </h3>
                <p className="mt-3 text-sm leading-6 text-gray-400">
                  Modern payment flow with Stripe and PayPal integration for a
                  trusted customer experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}