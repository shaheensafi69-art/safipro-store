import "./globals.css"
import StoreHeader from "@/components/layout/store-header"
import StoreFooter from "@/components/layout/store-footer"
import { CartProvider } from "@/components/cart/cart-provider"
import PayPalProvider from "@/components/providers/paypal-provider"
import Script from "next/script" // ۱. وارد کردن کامپوننت اسکریپت

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* ۲. اضافه کردن کد گوگل ادسنس */}
        <Script
          id="adsense-safipro"
          strategy="afterInteractive"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2430648749257681"
          crossOrigin="anonymous"
        />
      </head>
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