"use client"
import { usePathname } from "next/navigation"

const CfeFooter = () => {
  const pathname = usePathname()
  // No mostrar footer en la página de login
  if (pathname === "/login") {
    return null
  }
  return (
    <footer className="py-4 border-t border-border/40 bg-background">
      <div className="container text-center text-xs text-muted-foreground">
        Comisión Federal de Electricidad © {new Date().getFullYear()}. Todos los derechos reservados.
      </div>
    </footer>
  )
}

export default CfeFooter
