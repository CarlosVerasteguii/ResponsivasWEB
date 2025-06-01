"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import CfeAlert from "@/components/cfe/cfe-alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { UploadCloud, FileText, X, Loader2 } from "lucide-react"

export default function SubirResponsivaPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      validateAndSetFile(selectedFile)
    }
  }

  const validateAndSetFile = (selectedFile: File) => {
    if (selectedFile.type !== "application/pdf") {
      setError("Solo se permiten archivos PDF.")
      setFile(null)
      return
    }
    if (selectedFile.size > 45 * 1024 * 1024) {
      setError("El archivo excede el tamaño máximo de 45MB.")
      setFile(null)
      return
    }
    setFile(selectedFile)
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(false)
    setError(null)
    const droppedFile = event.dataTransfer.files?.[0]
    if (droppedFile) {
      validateAndSetFile(droppedFile)
      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(droppedFile)
        fileInputRef.current.files = dataTransfer.files
      }
    }
  }

  const handleSubmit = () => {
    setError(null)
    if (!file) {
      setError("Debe seleccionar un archivo PDF.")
      return
    }
    if (!isConfirmed) {
      setError("Debe confirmar la revisión del documento.")
      return
    }
    setIsLoading(true)
    console.log("Subiendo archivo:", file.name)
    setTimeout(() => {
      setIsLoading(false)
      localStorage.setItem("lastUploadedFile", file.name)
      router.push("/confirmacion-subida")
    }, 2000)
  }

  return (
    <div className="max-w-2xl mx-auto py-12">
      <Card className="rounded-cfe shadow-xl border-2 border-border">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-semibold text-cfe-black">Subir Responsiva Firmada (PDF)</CardTitle>
          <CardDescription className="text-muted-foreground text-base mt-2">
            Asegúrese de que el documento esté firmado y escaneado correctamente antes de continuar.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 p-8">
          {/* Área de carga mejorada */}
          <div
            className={`border-2 border-dashed rounded-cfe p-12 text-center cursor-pointer transition-all duration-200 ${
              isDragOver
                ? "border-cfe-green bg-cfe-green-very-light"
                : file
                  ? "border-cfe-green bg-cfe-green-very-light/50"
                  : "border-border bg-muted/20 hover:border-cfe-green hover:bg-muted/40"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadCloud
              className={`w-16 h-16 mx-auto mb-4 ${isDragOver ? "text-cfe-green" : "text-muted-foreground"}`}
            />
            <p className="text-base text-foreground font-medium mb-2">
              Arrastre su archivo PDF aquí o haga clic para seleccionar
            </p>
            <p className="text-sm text-muted-foreground">Solo archivos PDF • Tamaño máximo: 45MB</p>
            <Input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
            />
          </div>

          {/* Archivo seleccionado */}
          {file && (
            <div className="p-4 border border-cfe-green rounded-cfe bg-cfe-green-very-light flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="w-6 h-6 mr-3 text-cfe-green" />
                <div>
                  <p className="text-sm font-medium text-foreground">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setFile(null)
                  if (fileInputRef.current) fileInputRef.current.value = ""
                }}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          )}

          {/* Alerta de advertencia mejorada */}
          <CfeAlert
            variant="warning"
            message={
              <div className="space-y-2">
                <p className="font-semibold">Importante - Lea antes de continuar:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Asegúrese de que el documento esté firmado y escaneado correctamente.</li>
                  <li>Una vez subido, el archivo no podrá ser eliminado desde esta interfaz.</li>
                  <li>Si requiere correcciones posteriores, contacte al departamento de TI.</li>
                </ul>
              </div>
            }
          />

          {/* Checkbox de confirmación mejorado */}
          <div className="flex items-start space-x-3 p-4 border border-border rounded-cfe bg-background">
            <Checkbox
              id="confirmation"
              checked={isConfirmed}
              onCheckedChange={(checked) => setIsConfirmed(checked as boolean)}
              className="rounded-sm border-border data-[state=checked]:bg-cfe-green data-[state=checked]:text-cfe-text-on-green focus-visible:ring-cfe-green mt-1"
            />
            <Label
              htmlFor="confirmation"
              className="text-sm font-medium leading-relaxed cursor-pointer text-foreground"
            >
              Confirmo que he revisado el documento, está correctamente firmado y escaneado, y es la versión final que
              deseo subir. Entiendo que no podré eliminarlo una vez subido.
            </Label>
          </div>

          {/* Error */}
          {error && <CfeAlert variant="error" message={error} />}

          {/* Botones de acción mejorados */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4 border-t border-border">
            <Button
              variant="secondary"
              onClick={() => router.back()}
              className="bg-cfe-black text-secondary-foreground hover:bg-cfe-black/90 rounded-cfe px-6 py-2"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!file || !isConfirmed || isLoading}
              className="bg-cfe-green text-cfe-text-on-green hover:bg-cfe-green/90 disabled:opacity-50 disabled:cursor-not-allowed uppercase font-semibold rounded-cfe px-6 py-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Subiendo...
                </>
              ) : (
                <>
                  <UploadCloud className="mr-2 h-4 w-4" />
                  Subir y Finalizar
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
