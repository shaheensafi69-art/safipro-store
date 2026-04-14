import { NextResponse } from "next/server"
import { getPrintifyProducts } from "@/lib/suppliers/printify"

export async function GET() {
  try {
    const data = await getPrintifyProducts()

    const products = Array.isArray(data?.data) ? data.data : []

    const simplified = products.map((product: any) => ({
      id: product.id,
      title: product.title,
      description: product.description,
      visible: product.visible,
      is_locked: product.is_locked,
      created_at: product.created_at,
      updated_at: product.updated_at,
    }))

    return NextResponse.json({
      success: true,
      count: simplified.length,
      products: simplified,
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