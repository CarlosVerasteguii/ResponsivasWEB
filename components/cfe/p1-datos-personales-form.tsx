"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AREAS_EPS_EF, type UserData } from "@/lib/constants"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect } from "react"

interface DatosPersonalesFormProps {
  formData: Partial<UserData>
  setFormData: React.Dispatch<React.SetStateAction<Partial<UserData>>>
  loggedUser: { rpe: string; name: string; email: string }
}

const DatosPersonalesForm: React.FC<DatosPersonalesFormProps> = ({ formData, setFormData, loggedUser }) => {
  // Asegurarse de que los datos del usuario logueado se muestren correctamente
  useEffect(() => {
    console.log("LoggedUser en DatosPersonalesForm:", loggedUser)
    // Actualizar formData con los datos del usuario logueado
    setFormData((prev) => ({
      ...prev,
      rpe: loggedUser.rpe,
      nombre: loggedUser.name,
      correo: loggedUser.email,
    }))
  }, [loggedUser, setFormData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, areaEpsEf: value }))
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-cfe-black mb-6">Información para la Responsiva</h2>

      <Card className="rounded-cfe shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-cfe-black">Datos del Solicitante</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Datos de solo lectura en grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="font-semibold text-foreground">RPE:</Label>
              <div className="min-h-[40px] bg-muted px-3 py-2 rounded-cfe border border-border flex items-center">
                <span className="text-foreground font-medium">{formData.rpe || loggedUser.rpe}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="font-semibold text-foreground">Nombre:</Label>
              <div className="min-h-[40px] bg-muted px-3 py-2 rounded-cfe border border-border flex items-center">
                <span className="text-foreground font-medium">{formData.nombre || loggedUser.name}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-semibold text-foreground">Correo Electrónico:</Label>
            <div className="min-h-[40px] bg-muted px-3 py-2 rounded-cfe border border-border flex items-center">
              <span className="text-foreground font-medium">{formData.correo || loggedUser.email}</span>
            </div>
          </div>

          {/* Campos editables */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
            <div className="space-y-2">
              <Label htmlFor="areaEpsEf" className="font-semibold text-foreground">
                Área/EPS/EF: <span className="text-cfe-green font-bold">*</span>
              </Label>
              <Select value={formData.areaEpsEf} onValueChange={handleSelectChange}>
                <SelectTrigger className="w-full bg-input border-border rounded-cfe focus:ring-2 focus:ring-cfe-green focus:border-cfe-green">
                  <SelectValue placeholder="Seleccione un área" />
                </SelectTrigger>
                <SelectContent className="rounded-cfe bg-popover border-border shadow-lg">
                  {AREAS_EPS_EF.map((area) => (
                    <SelectItem
                      key={area}
                      value={area}
                      className="hover:bg-accent hover:text-accent-foreground cursor-pointer"
                    >
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="puestoSolicitante" className="font-semibold text-foreground">
                Puesto Solicitante: <span className="text-cfe-green font-bold">*</span>
              </Label>
              <Input
                id="puestoSolicitante"
                value={formData.puestoSolicitante || ""}
                onChange={handleChange}
                className="bg-input border-border rounded-cfe focus:ring-2 focus:ring-cfe-green focus:border-cfe-green"
                placeholder="Ingrese su puesto"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-cfe shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-cfe-black">Datos del Jefe Inmediato</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nombreJefe" className="font-semibold text-foreground">
                Nombre Completo del Jefe: <span className="text-cfe-green font-bold">*</span>
              </Label>
              <Input
                id="nombreJefe"
                value={formData.nombreJefe || ""}
                onChange={handleChange}
                className="bg-input border-border rounded-cfe focus:ring-2 focus:ring-cfe-green focus:border-cfe-green"
                placeholder="Nombre completo del jefe inmediato"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rpeJefe" className="font-semibold text-foreground">
                RPE del Jefe: <span className="text-cfe-green font-bold">*</span>
              </Label>
              <Input
                id="rpeJefe"
                value={formData.rpeJefe || ""}
                onChange={handleChange}
                className="bg-input border-border rounded-cfe focus:ring-2 focus:ring-cfe-green focus:border-cfe-green"
                placeholder="RPE del jefe inmediato"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="puestoJefe" className="font-semibold text-foreground">
              Puesto del Jefe: <span className="text-cfe-green font-bold">*</span>
            </Label>
            <Input
              id="puestoJefe"
              value={formData.puestoJefe || ""}
              onChange={handleChange}
              className="bg-input border-border rounded-cfe focus:ring-2 focus:ring-cfe-green focus:border-cfe-green"
              placeholder="Puesto del jefe inmediato"
              required
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DatosPersonalesForm
