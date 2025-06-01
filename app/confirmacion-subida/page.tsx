"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import CfeAlert from "@/components/cfe/cfe-alert"
import { Button } from "@/components/ui/button"
import { FilePlus2, LogOut, CheckCircle2 } from "lucide-react"

export default function ConfirmacionSubidaPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [solicitudId, setSolicitudId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const id = searchParams.get('id')
    console.log('Solicitud ID desde query params:', id);
    if (id) {
      setSolicitudId(id)
    } else {
      console.warn('No solicitudId found in query params.')
    }
    setIsLoading(false)
  }, [searchParams])

  const handleLogout = () => {
    localStorage.removeItem("cfe-user")
    localStorage.removeItem("lastUploadedFile")
    localStorage.removeItem("hideUploadBanner")
    router.push("/login")
  }

  const handleNewResponsiva = () => {
    localStorage.removeItem("lastUploadedFile")
    router.push("/dashboard")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-cfe-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Cargando confirmación...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-16 text-center">
      {/* Icono de éxito grande */}
      <div className="mb-8">
        <CheckCircle2 className="w-24 h-24 text-cfe-green mx-auto mb-4" />
      </div>

      {/* Alerta de éxito prominente */}
      <CfeAlert
        variant="success"
        title="¡Solicitud Enviada Exitosamente!"
        message={
          solicitudId
            ? `Su solicitud ha sido registrada correctamente. Su ID de Solicitud es: ${solicitudId}. Un compañero del departamento de TI se pondrá en contacto con usted por correo electrónico próximamente. Gracias por utilizar el sistema Generador de Responsivas TICSI.`
            : `Su solicitud ha sido procesada correctamente. Un compañero del departamento de TI se pondrá en contacto con usted por correo electrónico próximamente. Gracias por utilizar el sistema Generador de Responsivas TICSI.`
        }
        className="mb-12 text-left"
      />

      {/* Botones de acción prominentes */}
      <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
        <Button
          onClick={handleNewResponsiva}
          className="w-full sm:w-auto bg-cfe-green text-cfe-text-on-green hover:bg-cfe-green/90 uppercase font-semibold rounded-cfe py-4 px-8 text-base shadow-lg"
        >
          <FilePlus2 className="w-5 h-5 mr-3" />
          Generar Nueva Solicitud
        </Button>
        <Button
          variant="secondary"
          onClick={handleLogout}
          className="w-full sm:w-auto bg-cfe-black text-secondary-foreground hover:bg-cfe-black/90 uppercase font-semibold rounded-cfe py-4 px-8 text-base shadow-lg"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Cerrar Sesión
        </Button>
      </div>

      {/* Información adicional */}
      <div className="mt-12 p-6 bg-muted/30 rounded-cfe border border-border">
        <p className="text-sm text-muted-foreground">
          Si tiene alguna pregunta sobre el estado de su responsiva o necesita asistencia adicional, contacte al
          departamento de TI de CFE.
        </p>
      </div>
    </div>
  )
}
