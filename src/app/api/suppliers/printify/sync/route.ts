import { NextResponse } from "next/server"
import {
  getPrintifyProducts,
  getPrintifyProductById,
} from "@/lib/suppliers/printify"
import {
  normalizePrintifyProduct,
  normalizePrintifyVariants,
  normalizePrintifyImages,
} from "@/lib/suppliers/normalizers"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST() {
  try {
    const supabase = createAdminClient()
    const response = await getPrintifyProducts()
    const products = Array.isArray(response?.data) ? response.data : []

    const results: any[] = []

    for (const listProduct of products) {
      try {
        const fullProduct = await getPrintifyProductById(String(listProduct.id))

        const normalizedProduct = normalizePrintifyProduct(fullProduct)

        const { data: savedProduct, error: productError } = await supabase
          .from("products")
          .upsert(normalizedProduct, {
            onConflict: "provider,external_product_id",
          })
          .select("id, title, slug, provider, external_product_id")
          .single()

        if (productError || !savedProduct) {
          results.push({
            success: false,
            stage: "product",
            title: normalizedProduct.title,
            external_product_id: normalizedProduct.external_product_id,
            error: productError?.message || "Failed to save product",
          })
          continue
        }

        const internalProductId = savedProduct.id

        const normalizedVariants = normalizePrintifyVariants(
          internalProductId,
          fullProduct
        )

        const { error: deleteVariantsError } = await supabase
          .from("product_variants")
          .delete()
          .eq("product_id", internalProductId)

        if (deleteVariantsError) {
          results.push({
            success: false,
            stage: "variants_delete",
            title: normalizedProduct.title,
            external_product_id: normalizedProduct.external_product_id,
            error: deleteVariantsError.message,
          })
          continue
        }

        if (normalizedVariants.length > 0) {
          const { error: insertVariantsError } = await supabase
            .from("product_variants")
            .insert(normalizedVariants)

          if (insertVariantsError) {
            results.push({
              success: false,
              stage: "variants_insert",
              title: normalizedProduct.title,
              external_product_id: normalizedProduct.external_product_id,
              error: insertVariantsError.message,
            })
            continue
          }
        }

        const normalizedImages = normalizePrintifyImages(
          internalProductId,
          fullProduct
        )

        const { error: deleteImagesError } = await supabase
          .from("product_images")
          .delete()
          .eq("product_id", internalProductId)

        if (deleteImagesError) {
          results.push({
            success: false,
            stage: "images_delete",
            title: normalizedProduct.title,
            external_product_id: normalizedProduct.external_product_id,
            error: deleteImagesError.message,
          })
          continue
        }

        if (normalizedImages.length > 0) {
          const { error: insertImagesError } = await supabase
            .from("product_images")
            .insert(normalizedImages)

          if (insertImagesError) {
            results.push({
              success: false,
              stage: "images_insert",
              title: normalizedProduct.title,
              external_product_id: normalizedProduct.external_product_id,
              error: insertImagesError.message,
            })
            continue
          }
        }

        results.push({
          success: true,
          title: normalizedProduct.title,
          external_product_id: normalizedProduct.external_product_id,
          variants_count: normalizedVariants.length,
          images_count: normalizedImages.length,
        })
      } catch (error) {
        results.push({
          success: false,
          stage: "unknown",
          title: listProduct?.title || "Unknown",
          external_product_id: String(listProduct?.id || ""),
          error: error instanceof Error ? error.message : "Unknown error",
        })
      }
    }

    return NextResponse.json({
      success: true,
      total: products.length,
      imported: results.filter((item) => item.success).length,
      failed: results.filter((item) => !item.success).length,
      results,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}