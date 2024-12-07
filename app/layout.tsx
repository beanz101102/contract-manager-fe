import "@/styles/globals.css"
import { Viewport } from "next/dist/lib/metadata/types/extra-types"

import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"

import Providers from "./providers"

interface RootLayoutProps {
  children: React.ReactNode
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "min-h-screen bg-gray-100 font-sans antialiased text-black",
            fontSans.variable
          )}
        >
          <Providers>{children}</Providers>
        </body>
      </html>
    </>
  )
}
