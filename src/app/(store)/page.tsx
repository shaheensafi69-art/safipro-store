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
    <main className="bg-black text-white">

      {/* HERO */}
      <section className="relative overflow-hidden py-28 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.15),transparent_70%)]" />

        <h1 className="text-5xl font-bold text-[#D4AF37] sm:text-6xl">
          SafiPro
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-gray-300 text-lg">
          Luxury streetwear inspired by leadership, power, and future mindset
        </p>

        <Link
          href="/shop"
          className="mt-8 inline-block rounded-2xl bg-[#D4AF37] px-8 py-4 font-semibold text-black transition hover:bg-[#E6C766]"
        >
          Shop Now
        </Link>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-3xl font-bold text-[#D4AF37] mb-10">
          Featured Products
        </h2>

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
                className="group rounded-3xl border border-[#2b2b2b] bg-[#0A0A0A]/90 overflow-hidden hover:border-[#D4AF37]/40 transition"
              >
                <div className="aspect-square overflow-hidden">
                  {image?.image_url ? (
                    <img
                      src={image.image_url}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-500">
                      No image
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-white font-semibold line-clamp-2">
                    {product.title}
                  </h3>

                  <div className="mt-2 text-[#D4AF37] font-bold">
                    {variant
                      ? `${variant.selling_price} ${variant.currency}`
                      : "—"}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* WHY SAFIPRO */}
      <section className="bg-[#0A0A0A] py-20 text-center">
        <h2 className="text-3xl font-bold text-[#D4AF37]">
          Why SafiPro
        </h2>

        <div className="mt-10 grid gap-8 sm:grid-cols-3 px-6">
          <div>
            <h3 className="text-xl font-semibold">Premium Quality</h3>
            <p className="mt-2 text-gray-400">
              High-end materials designed for comfort and durability
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">Fast Shipping</h3>
            <p className="mt-2 text-gray-400">
              Reliable and fast worldwide delivery
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">Luxury Design</h3>
            <p className="mt-2 text-gray-400">
              Inspired by leadership and elite mindset
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center">
        <h2 className="text-4xl font-bold text-[#D4AF37]">
          Ready to Elevate Your Style?
        </h2>

        <Link
          href="/shop"
          className="mt-8 inline-block rounded-2xl border border-[#D4AF37] px-8 py-4 text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-black"
        >
          Explore Collection
        </Link>
      </section>
    </main>
  )
}