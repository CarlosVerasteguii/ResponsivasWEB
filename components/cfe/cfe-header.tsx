"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogOut, UploadCloud, UserCircle } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

// Simulación de datos de usuario
interface User {
  name: string
  rpe: string
  email: string
}

const CfeHeader = () => {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Simular obtención de datos de usuario del localStorage o API
    const storedUser = localStorage.getItem("cfe-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      // Si no hay usuario y no estamos en login, redirigir a login
      if (pathname !== "/login") {
        // router.push("/login"); // Descomentar para forzar login
      }
    }
  }, [pathname, router])

  const handleLogout = () => {
    localStorage.removeItem("cfe-user")
    setUser(null)
    router.push("/login")
  }

  // No mostrar header en la página de login
  if (pathname === "/login") {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background shadow-sm">
      <div className="container flex h-[70px] items-center justify-between px-4">
        <Link href={user ? "/dashboard" : "/login"} className="flex items-center gap-3">
          {/* Logo CFE más prominente */}
          <div className="bg-cfe-green text-cfe-text-on-green p-3 rounded-sm text-lg font-bold shadow-sm">CFE</div>
          <span className="font-semibold text-cfe-black text-lg hidden sm:inline-block">
            Generador de Responsivas TICSI v1.0
          </span>
        </Link>

        {user && (
          <div className="flex items-center gap-4">
            {/* Botón Subir Responsiva más prominente */}
            <Button
              variant="secondary"
              size="default"
              onClick={() => router.push("/subir-responsiva")}
              className="bg-cfe-black text-secondary-foreground hover:bg-cfe-black/90 font-semibold px-4 py-2 rounded-cfe shadow-sm"
            >
              <UploadCloud className="w-4 h-4 mr-2" />
              Subir Responsiva
            </Button>

            {/* Separador visual */}
            <div className="h-8 w-px bg-border"></div>

            {/* Información de usuario */}
            <div className="flex items-center gap-2 text-sm">
              <UserCircle className="w-5 h-5 text-cfe-green" />
              <span className="text-foreground font-medium">Bienvenido/a, {user.name.split(" ")[0]}</span>
            </div>

            {/* Botón cerrar sesión */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-cfe-black hover:bg-accent px-3 py-2"
            >
              <LogOut className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}

export default CfeHeader
