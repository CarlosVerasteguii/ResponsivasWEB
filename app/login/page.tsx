"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import CfeAlert from "@/components/cfe/cfe-alert"
import { Settings } from "lucide-react"

// Simulación de datos de usuario para login
const MOCK_USERS = [
  { rpe: "USER001", password: "password123", name: "Juan Pérez García", email: "juan.perez@cfe.mx" },
  { rpe: "DEV001", password: "devpassword", name: "Desarrollador CFE", email: "dev@cfe.mx" },
  { rpe: "STD001", password: "123456", name: "María Elena Rodríguez López", email: "maria.rodriguez@cfe.mx" },
  { rpe: "TEST001", password: "test123", name: "Carlos Alberto Hernández Vega", email: "carlos.hernandez@cfe.mx" },
  { rpe: "DEMO001", password: "demo", name: "Ana Patricia Morales Jiménez", email: "ana.morales@cfe.mx" },
]

export default function LoginPage() {
  const router = useRouter()
  const [rpe, setRpe] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Simulación de autenticación
    setTimeout(() => {
      const user = MOCK_USERS.find((u) => u.rpe === rpe && u.password === password)
      if (user) {
        localStorage.setItem("cfe-user", JSON.stringify({ name: user.name, rpe: user.rpe, email: user.email }))
        router.push("/dashboard")
      } else {
        setError("RPE o contraseña incorrectos. Verifique sus datos.")
      }
      setIsLoading(false)
    }, 1000)
  }

  const handleDevAccess = () => {
    // Simular login de desarrollador
    setRpe("DEV001")
    setPassword("devpassword")
    // Opcionalmente, hacer submit automático o permitir al usuario hacer clic en "INICIAR SESIÓN"
    const devUser = MOCK_USERS.find((u) => u.rpe === "DEV001")
    if (devUser) {
      localStorage.setItem("cfe-user", JSON.stringify({ name: devUser.name, rpe: devUser.rpe, email: devUser.email }))
      router.push("/dashboard")
    }
  }

  const handleQuickLogin = (rpe: string, password: string) => {
    setRpe(rpe)
    setPassword(password)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="mb-8 flex flex-col items-center">
        {/* Placeholder para el logo CFE */}
        <div className="bg-cfe-green text-cfe-text-on-green p-4 rounded-md text-2xl font-bold mb-4">CFE</div>
        <h1 className="text-3xl font-bold text-cfe-black">Generador de Responsivas TICSI</h1>
      </div>
      <Card className="w-full max-w-md shadow-lg rounded-cfe">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold text-cfe-black">Inicio de Sesión</CardTitle>
          <CardDescription className="text-muted-foreground">Generador de Responsivas TICSI</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="rpe" className="text-foreground font-semibold">
                RPE
              </Label>
              <Input
                id="rpe"
                type="text"
                placeholder="Ingrese su RPE"
                value={rpe}
                onChange={(e) => setRpe(e.target.value)}
                required
                className="bg-input border-border rounded-cfe focus:ring-cfe-green"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-semibold">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-input border-border rounded-cfe focus:ring-cfe-green"
              />
            </div>
            {error && <CfeAlert variant="error" message={error} />}
            <Button
              type="submit"
              className="w-full bg-cfe-green text-cfe-text-on-green hover:bg-cfe-green/90 uppercase font-semibold rounded-cfe"
              disabled={isLoading}
            >
              {isLoading ? "Iniciando..." : "Iniciar Sesión"}
            </Button>
          </form>
          {/* Credenciales de prueba para desarrollo */}
          <div className="mt-6 p-4 bg-cfe-green-very-light rounded-cfe border border-cfe-green/30">
            <h4 className="font-semibold text-cfe-green mb-3 text-center">👥 Usuarios de Prueba Disponibles</h4>
            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-3 gap-2 font-semibold text-cfe-black border-b pb-1">
                <span>RPE</span>
                <span>Contraseña</span>
                <span>Usuario</span>
              </div>
              <div
                className="grid grid-cols-3 gap-2 text-muted-foreground hover:bg-cfe-green/10 cursor-pointer p-1 rounded transition-colors"
                onClick={() => handleQuickLogin("STD001", "123456")}
              >
                <span>STD001</span>
                <span>123456</span>
                <span>María Elena R.</span>
              </div>
              <div
                className="grid grid-cols-3 gap-2 text-muted-foreground hover:bg-cfe-green/10 cursor-pointer p-1 rounded transition-colors"
                onClick={() => handleQuickLogin("TEST001", "test123")}
              >
                <span>TEST001</span>
                <span>test123</span>
                <span>Carlos Alberto H.</span>
              </div>
              <div
                className="grid grid-cols-3 gap-2 text-muted-foreground hover:bg-cfe-green/10 cursor-pointer p-1 rounded transition-colors"
                onClick={() => handleQuickLogin("DEMO001", "demo")}
              >
                <span>DEMO001</span>
                <span>demo</span>
                <span>Ana Patricia M.</span>
              </div>
              <div
                className="grid grid-cols-3 gap-2 text-muted-foreground hover:bg-cfe-green/10 cursor-pointer p-1 rounded transition-colors"
                onClick={() => handleQuickLogin("USER001", "password123")}
              >
                <span>USER001</span>
                <span>password123</span>
                <span>Juan Pérez G.</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              💡 Haga clic en cualquier fila para auto-completar los campos
            </p>
          </div>
          <div className="mt-6 text-center">
            <Button
              variant="link"
              onClick={handleDevAccess}
              className="text-sm text-cfe-black hover:text-cfe-green p-0 h-auto flex items-center"
            >
              <Settings className="w-4 h-4 mr-2" />
              Acceso Desarrollo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
