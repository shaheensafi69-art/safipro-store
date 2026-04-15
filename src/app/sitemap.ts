import { MetadataRoute } from "next"
import { createAdminClient } from "@/lib/supabase/admin"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.safipro.site"

  const supabase = createAdminClient()

  const { data: products } = await supabase
    .from("products")
    .select("slug, updated_at")
    .eq("status", "active")
    .eq("visible", true)

  const productUrls =
    products?.map((product) => ({
      url: `${baseUrl}/shop/${product.slug}`,
      lastModified: product.updated_at
        ? new Date(product.updated_at)
        : new Date(),
    })) || []

  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
    },
    ...productUrls,
  ]
}