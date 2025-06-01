"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import StepIndicator from "@/components/cfe/step-indicator"
import { STEPS_RESPONSIVA, type UserData, type SitioSeleccionado } from "@/lib/constants"
import DatosPersonalesForm from "@/components/cfe/p1-datos-personales-form"
import SeleccionSitios from "@/components/cfe/p2-seleccion-sitios"
import AsignarPermisos from "@/components/cfe/p3-asignar-permisos"
import RevisionResponsiva from "@/components/cfe/p4-revision-responsiva"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Download } from "lucide-react"
import CfeAlert from "@/components/cfe/cfe-alert"

// Simulación de datos de usuario logueado
interface LoggedUser {
  name: string
  rpe: string
  email: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [loggedUser, setLoggedUser] = useState<LoggedUser | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Partial<UserData>>({})
  const [selectedSitios, setSelectedSitios] = useState<SitioSeleccionado[]>([])
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("cfe-user")
    if (storedUser) {
      const parsedUser: LoggedUser = JSON.parse(storedUser)
      setLoggedUser(parsedUser)
      setFormData((prev) => ({
        ...prev,
        rpe: parsedUser.rpe,
        nombre: parsedUser.name,
        correo: parsedUser.email,
      }))
    } else {
      // router.push("/login"); // Descomentar para forzar login
    }
  }, [router])

  const handleNextStep = () => {
    setGlobalError(null)
    // Validaciones específicas por paso antes de avanzar
    if (currentStep === 1) {
      if (
        !formData.areaEpsEf ||
        !formData.puestoSolicitante ||
        !formData.nombreJefe ||
        !formData.rpeJefe ||
        !formData.puestoJefe
      ) {
        setGlobalError("Todos los campos marcados con * son obligatorios.")
        return
      }
    }
    if (currentStep === 2) {
      if (selectedSitios.length === 0) {
        setGlobalError("Debe seleccionar al menos un sitio o servicio.")
        return
      }
      // Inicializar permisos para nuevos sitios
      setSelectedSitios((prevSitios) => prevSitios.map((s) => ({ ...s, permiso: s.permiso || "Usuario Estándar" })))
    }
    if (currentStep === 3) {
      const sinPermiso = selectedSitios.some((s) => !s.permiso)
      if (sinPermiso) {
        setGlobalError("Debe asignar un tipo de permiso a cada sitio/servicio seleccionado.")
        return
      }
    }
    if (currentStep < STEPS_RESPONSIVA.length) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrevStep = () => {
    setGlobalError(null)
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleGenerateDocument = async () => {
    setGlobalError(null)
    setIsLoading(true)

    const payload = {
      solicitante: {
        rpe: formData.rpe || '',
        nombre: formData.nombre || '',
        correo: formData.correo || '',
        areaSeleccionada: formData.areaEpsEf || '',
        puestoIngresado: formData.puestoSolicitante || '',
      },
      jefe: {
        nombre: formData.nombreJefe || '',
        rpe: formData.rpeJefe || '',
        puesto: formData.puestoJefe || '',
      },
      sistemasSeleccionados: selectedSitios.map(sitio => ({
        nombreDelSistema: sitio.name,
        rolDelUsuario: sitio.permiso || 'Usuario Estándar', // Default rol if none assigned
      })),
      fechaSolicitud: new Date().toISOString(),
    }

    console.log('Enviando payload a backend:', payload)

    try {
      const response = await fetch('http://localhost:5000/api/solicitudes/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      setIsLoading(false)

      if (response.ok) {
        const result = await response.json()
        const solicitudId = result.solicitudId || 'N/A' // Backend returns { success: true, message: '...', solicitudId: '...' }
        console.log('Solicitud registrada con ID:', solicitudId)

        // Navigate to confirmation page (assuming path is /confirmacion-subida)
        // Pass the solicitudId as a query parameter or via context if needed on the confirmation page
        router.push(`/confirmacion-subida?id=${solicitudId}`)

      } else {
        const errorData = await response.json()
        const errorMessage = errorData.error?.message || `Error: ${response.status} ${response.statusText}`
        console.error('Error al registrar solicitud:', errorMessage)
        setGlobalError(`Error al enviar la solicitud: ${errorMessage}`)
      }
    } catch (error: any) {
      setIsLoading(false)
      console.error('Error en la petición:', error)
      setGlobalError(`Error en la comunicación con el servidor: ${error.message}`)
    }
  }

  const resetFlow = () => {
    setCurrentStep(1)
    const storedUser = localStorage.getItem("cfe-user")
    const parsedUser: LoggedUser | null = storedUser ? JSON.parse(storedUser) : null
    setFormData({ rpe: parsedUser?.rpe, nombre: parsedUser?.name, correo: parsedUser?.email })
    setSelectedSitios([])
    setGlobalError(null)
  }

  if (!loggedUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Cargando datos de usuario...</p>
      </div>
    ) // O un spinner
  }

  // Banner para subir responsiva existente
  // const showUploadBanner = currentStep === 1 && !localStorage.getItem("hideUploadBanner")

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* {showUploadBanner && (
        <CfeAlert
          variant="info"
          title="¿Ya tienes una responsiva generada y firmada?"
          message={
            <>
              Si ya generaste, firmaste y escaneaste tu responsiva, puedes{" "}
              <Button
                variant="link"
                className="p-0 h-auto text-cfe-green hover:underline"
                onClick={() => router.push("/subir-responsiva")}
              >
                Subirla Aquí Directamente
              </Button>
              .
              <Button
                variant="ghost"
                size="sm"
                className="ml-4 text-xs"
                onClick={() => localStorage.setItem("hideUploadBanner", "true")}
              >
                Ocultar
              </Button>
            </>
          }
          className="mb-6"
        />
      )} */}

      <StepIndicator steps={STEPS_RESPONSIVA} currentStep={currentStep} />

      {/* Banner informativo para P1 */}
      {currentStep === 1 && !localStorage.getItem("hideUploadBanner") && (
        <CfeAlert
          variant="info"
          title="¿Ya tienes una responsiva generada y firmada?"
          message={
            <div className="flex items-center justify-between">
              <span>
                ¿Ya generaste, firmaste y escaneaste tu responsiva? Puedes hacer clic en{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto text-cfe-green hover:underline font-semibold"
                  onClick={() => router.push("/subir-responsiva")}
                >
                  'Subir Responsiva'
                </Button>{" "}
                en el encabezado para omitir este formulario.
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="ml-4 text-xs hover:bg-transparent"
                onClick={() => {
                  localStorage.setItem("hideUploadBanner", "true")
                  window.location.reload()
                }}
              >
                Ocultar
              </Button>
            </div>
          }
          className="mb-6"
        />
      )}

      {globalError && <CfeAlert variant="error" message={globalError} className="mb-4" />}

      <div className="p-6 bg-card border rounded-cfe shadow-md">
        {currentStep === 1 && (
          <DatosPersonalesForm formData={formData} setFormData={setFormData} loggedUser={loggedUser} />
        )}
        {currentStep === 2 && <SeleccionSitios selectedSitios={selectedSitios} setSelectedSitios={setSelectedSitios} />}
        {currentStep === 3 && <AsignarPermisos selectedSitios={selectedSitios} setSelectedSitios={setSelectedSitios} />}
        {currentStep === 4 && (
          <RevisionResponsiva
            formData={formData}
            selectedSitios={selectedSitios}
            onEdit={(step) => setCurrentStep(step)}
          />
        )}

        <div className="mt-8 flex justify-between items-center pt-6 border-t border-border">
          <div>
            {currentStep > 1 && (
              <Button
                variant="secondary"
                onClick={handlePrevStep}
                className="bg-cfe-black text-secondary-foreground hover:bg-cfe-black/90 rounded-cfe font-semibold px-6 py-2"
                disabled={isLoading}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                ANTERIOR
              </Button>
            )}
          </div>
          <div>
            {currentStep < STEPS_RESPONSIVA.length && (
              <Button
                onClick={handleNextStep}
                className="bg-cfe-green text-cfe-text-on-green hover:bg-cfe-green/90 uppercase font-semibold rounded-cfe px-6 py-2"
                disabled={isLoading}
              >
                SIGUIENTE
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
            {currentStep === STEPS_RESPONSIVA.length && (
              <Button
                onClick={handleGenerateDocument}
                className="bg-cfe-green text-cfe-text-on-green hover:bg-cfe-green/90 uppercase font-semibold rounded-cfe px-6 py-2 text-base"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Enviar Solicitud
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
