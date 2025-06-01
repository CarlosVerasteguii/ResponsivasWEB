"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import CfeAlert from "@/components/cfe/cfe-alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUp, AlertCircle } from "lucide-react"

export default function DocumentoGeneradoPage() {
  const router = useRouter()
  const [responsivaId, setResponsivaId] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  useEffect(() => {
    const id = localStorage.getItem("lastResponsivaId")
    const userData = localStorage.getItem("cfe-user")

    if (id && userData) {
      setResponsivaId(id)
      const user = JSON.parse(userData)
      // Generar nombre de archivo correcto: rpe_nombre_responsivaId.docx
      const nombreLimpio = user.name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "")
      const nombreArchivo = `${user.rpe}_${nombreLimpio}_${id}.docx`

      // Simular descarga automática con nombre correcto
      console.log(`Simulando descarga de ${nombreArchivo}`)

      // Guardar el nombre del archivo para mostrarlo en la UI
      localStorage.setItem("lastGeneratedFileName", nombreArchivo)
      setFileName(nombreArchivo)
    } else {
      // Si no hay ID, quizás redirigir o mostrar error
      // router.push("/dashboard");
    }
  }, [router])

  if (!responsivaId) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-cfe-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Cargando información del documento...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto py-12">
      {/* Alerta de éxito prominente */}
      <CfeAlert
        variant="success"
        title="¡Documento Generado Exitosamente!"
        message={
          <div className="space-y-2">
            <p>
              <strong>ID de Responsiva:</strong> {responsivaId}
            </p>
            <p>
              El archivo{" "}
              <code className="bg-white/20 px-2 py-1 rounded text-sm">
                {fileName || `nombre_responsiva_${responsivaId}.docx`}
              </code>{" "}
              se ha descargado automáticamente.
            </p>
            <p>
              Si la descarga no inicia,{" "}
              <button
                onClick={() => console.log("Reintentar descarga")}
                className="underline text-cfe-text-on-green hover:text-white/80 font-semibold"
              >
                haga clic aquí para descargar manualmente
              </button>
              .
            </p>
          </div>
        }
        className="mb-10"
      />

      {/* Sección de pasos importantes - más prominente */}
      <Card className="text-left rounded-cfe shadow-lg border-2 border-cfe-green/20">
        <CardHeader className="bg-cfe-green-very-light">
          <CardTitle className="text-xl text-cfe-black flex items-center">
            <AlertCircle className="w-6 h-6 mr-3 text-cfe-green" />
            Siguientes Pasos Importantes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <ol className="list-decimal list-inside space-y-4 text-base text-foreground leading-relaxed">
            <li className="pl-2">
              <strong>Revise el documento Word descargado</strong> para verificar que toda la información sea correcta.
            </li>
            <li className="pl-2">
              <strong>Si todo es correcto, imprímalo y fírmelo</strong> en los espacios designados.
            </li>
            <li className="pl-2">
              <strong>Escanee el documento firmado</strong> en un único archivo PDF de alta calidad.
            </li>
            <li className="pl-2">
              <strong>Regrese a esta aplicación</strong> y utilice el botón 'Subir Responsiva Firmada' para completar el
              proceso.
            </li>
          </ol>

          <div className="mt-6 p-4 bg-highlight-yellow rounded-cfe border border-yellow-300">
            <p className="text-sm text-foreground">
              <strong>Importante:</strong> Conserve una copia del documento firmado para sus registros personales.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Botón de acción principal - más prominente */}
      <div className="text-center mt-10">
        <Button
          onClick={() => router.push("/subir-responsiva")}
          className="bg-cfe-green text-cfe-text-on-green hover:bg-cfe-green/90 uppercase font-semibold rounded-cfe py-4 px-8 text-lg shadow-lg"
        >
          <FileUp className="w-6 h-6 mr-3" />
          Subir Responsiva Firmada
        </Button>

        <p className="text-sm text-muted-foreground mt-4">
          También puede acceder a esta función desde el botón "Subir Responsiva" en el encabezado.
        </p>
      </div>
    </div>
  )
}
