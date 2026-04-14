import "./globals.css"
import StoreHeader from "@/components/layout/store-header"
import StoreFooter from "@/components/layout/store-footer"
import { CartProvider } from "@/components/cart/cart-provider"
import PayPalProvider from "@/components/providers/paypal-provider"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <PayPalProvider>
          <CartProvider>
            <StoreHeader />
            <main>{children}</main>
            <StoreFooter />
          </CartProvider>
        </PayPalProvider>
      </body>
    </html>
  )
}