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
  sort_order: number
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

export default async function ShopPage() {
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

  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-red-300">
          Failed to load products: {error.message}
        </div>
      </main>
    )
  }

  const products = (data || []) as ProductRow[]
  const availableCount = products.length

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[32px] border border-[#2b2b2b] bg-[#0A0A0A]/90 px-6 py-10 shadow-[0_12px_40px_rgba(0,0,0,0.35)] sm:px-10 sm:py-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.14),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(212,175,55,0.08),transparent_28%)]" />

        <div className="relative grid gap-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-center">
          <div>
            <div className="inline-flex items-center rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#E6C766]">
              SafiPro Luxury Store
            </div>

            <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-tight text-white sm:text-5xl">
              Premium Products with a{" "}
              <span className="text-[#D4AF37]">Luxury Black & Gold</span>{" "}
              Experience
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-300 sm:text-base">
              Discover carefully curated products designed with a bold premium
              identity. Clean presentation, powerful visuals, and a refined
              storefront built for SafiPro.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <div className="rounded-2xl border border-[#2b2b2b] bg-black/40 px-5 py-4">
                <div className="text-xs uppercase tracking-[0.2em] text-gray-400">
                  Active Products
                </div>
                <div className="mt-1 text-2xl font-bold text-[#D4AF37]">
                  {availableCount}
                </div>
              </div>

              <div className="rounded-2xl border border-[#2b2b2b] bg-black/40 px-5 py-4">
                <div className="text-xs uppercase tracking-[0.2em] text-gray-400">
                  Store Style
                </div>
                <div className="mt-1 text-2xl font-bold text-white">
                  Premium
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-3xl border border-[#2b2b2b] bg-gradient-to-br from-[#111111] to-[#0A0A0A] p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-gray-400">
                Signature
              </div>
              <div className="mt-3 text-xl font-bold text-[#D4AF37]">
                Black & Gold
              </div>
              <p className="mt-2 text-sm leading-6 text-gray-400">
                A luxury storefront style built to feel modern, premium, and
                brand-ready.
              </p>
            </div>

            <div className="rounded-3xl border border-[#2b2b2b] bg-gradient-to-br from-[#111111] to-[#0A0A0A] p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-gray-400">
                Experience
              </div>
              <div className="mt-3 text-xl font-bold text-white">
                Smooth Browsing
              </div>
              <p className="mt-2 text-sm leading-6 text-gray-400">
                Clear cards, strong imagery, better product focus, and premium
                visual rhythm.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Toolbar */}
      <section className="mt-8 flex flex-col gap-4 rounded-3xl border border-[#2b2b2b] bg-[#0A0A0A]/80 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Featured Collection</h2>
          <p className="mt-1 text-sm text-gray-400">
            Browse all available products in the SafiPro store
          </p>
        </div>

        <div className="inline-flex w-fit items-center rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-4 py-2 text-sm font-medium text-[#E6C766]">
          {availableCount} product{availableCount === 1 ? "" : "s"} available
        </div>
      </section>

      {/* Grid */}
      {products.length === 0 ? (
        <section className="mt-8 rounded-3xl border border-[#2b2b2b] bg-[#0A0A0A]/90 p-10 text-center">
          <div className="mx-auto max-w-xl">
            <h3 className="text-2xl font-semibold text-white">No Products Found</h3>
            <p className="mt-3 text-sm leading-7 text-gray-400">
              There are no active products available right now. Once products are
              synced and published, they will appear here automatically.
            </p>
          </div>
        </section>
      ) : (
        <section className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
                className="group relative overflow-hidden rounded-[28px] border border-[#2b2b2b] bg-[#0A0A0A]/90 shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1.5 hover:border-[#D4AF37]/40 hover:shadow-[0_0_30px_rgba(212,175,55,0.16)]"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.08),transparent_30%)] opacity-0 transition duration-300 group-hover:opacity-100" />

                <div className="relative aspect-[4/4.2] overflow-hidden bg-gradient-to-b from-[#111111] to-black">
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

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

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
                </div>

                <div className="relative p-5">
                  <h3 className="line-clamp-2 text-lg font-semibold leading-7 text-white transition group-hover:text-[#F3D46A]">
                    {product.title}
                  </h3>

                  {product.short_description ? (
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-400">
                      {product.short_description}
                    </p>
                  ) : (
                    <p className="mt-3 text-sm leading-6 text-gray-500">
                      Curated premium product from the SafiPro collection.
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
                      View Product
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </section>
      )}
    </main>
  )
}