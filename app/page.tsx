"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

// Esta página raíz simplemente redirigirá a /login
export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/login")
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirigiendo...</p>
    </div>
  )
}
