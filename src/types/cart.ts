export type CartItem = {
  id: string
  productId: string
  variantId: string
  title: string
  slug: string
  image: string | null
  size: string | null
  color: string | null
  sku: string | null
  price: number
  currency: string
  quantity: number
}