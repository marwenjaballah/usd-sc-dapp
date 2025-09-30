import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Web3Provider } from "@/providers/web3-provider"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "USD-SC DApp | Sharia Compliant Stablecoin",
  description: "Manage your USD-SC Sharia Compliant Stablecoin",
  generator: "peaksoft",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <Web3Provider>
            {children}
            <Toaster />
          </Web3Provider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
