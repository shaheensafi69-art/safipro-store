import { NextResponse } from "next/server"
import { getPrintifyProducts, getPrintifyProductById } from "@/lib/suppliers/printify"

export async function GET() {
  try {
    const response = await getPrintifyProducts()
    const products = Array.isArray(response?.data) ? response.data : []

    if (products.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No products found in Printify",
      })
    }

    const firstProductId = String(products[0].id)
    const fullProduct = await getPrintifyProductById(firstProductId)

    const variants = Array.isArray(fullProduct?.variants) ? fullProduct.variants : []

    const cleaned = variants.map((variant: any) => ({
      id: variant?.id,
      sku: variant?.sku,
      title: variant?.title,
      options: variant?.options,
      is_enabled: variant?.is_enabled,
      is_available: variant?.is_available,
      price: variant?.price,
    }))

    return NextResponse.json({
      success: true,
      product_id: firstProductId,
      title: fullProduct?.title,
      total_variants: cleaned.length,
      variants: cleaned,
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