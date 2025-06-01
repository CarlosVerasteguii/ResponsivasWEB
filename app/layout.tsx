import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google" // Usaremos Inter como fallback si Noto Sans no carga
import "./globals.css"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import CfeHeader from "@/components/cfe/cfe-header"
import CfeFooter from "@/components/cfe/cfe-footer"
import ThemeForceLight from "@/components/cfe/theme-force-light"

// Simulación de carga de Noto Sans. En un proyecto real, se configuraría correctamente.
// Para Next.js, nos basaremos en los fallbacks definidos en tailwind.config.ts y globals.css
const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "CFE - Generador de Responsivas TICSI v1.0",
  description: "Aplicación interna para la generación y gestión de cartas responsivas.",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* En un proyecto real, aquí se enlazaría Noto Sans si no se usa next/font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn("min-h-screen bg-background font-sans antialiased flex flex-col", fontSans.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light" // CFE guía parece enfocada en tema claro
          disableTransitionOnChange
        >
          <ThemeForceLight />{/* Componente para forzar el tema claro */}
          <CfeHeader />
          <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
          <CfeFooter />
        </ThemeProvider>
      </body>
    </html>
  )
}
