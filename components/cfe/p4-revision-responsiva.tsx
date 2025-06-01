"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { UserData, SitioSeleccionado } from "@/lib/constants"
import { Edit3, User, UserCheck, Settings } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface RevisionResponsivaProps {
  formData: Partial<UserData>
  selectedSitios: SitioSeleccionado[]
  onEdit: (step: number) => void
}

const DataRow: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 py-2">
    <span className="font-semibold text-foreground">{label}:</span>
    <span className="text-muted-foreground md:col-span-2">{value || "-"}</span>
  </div>
)

const RevisionResponsiva: React.FC<RevisionResponsivaProps> = ({ formData, selectedSitios, onEdit }) => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-cfe-black mb-4">Verifique la Información de la Responsiva</h2>

        {/* Instrucciones para revisión */}
        <div className="bg-highlight-yellow p-4 rounded-cfe border border-yellow-300 max-w-3xl mx-auto">
          <p className="text-foreground font-medium">
            <strong>⚠️ IMPORTANTE:</strong> Revise cuidadosamente toda la información antes de generar el documento. Una
            vez generado, deberá imprimirlo, firmarlo y subirlo al sistema.
          </p>
        </div>

        <p className="text-sm text-muted-foreground mt-3">
          Si encuentra algún error, use los botones de "Editar" para corregir la información.
        </p>
      </div>

      {/* Botones de edición prominentes */}
      <div className="flex flex-wrap justify-center gap-3 p-4 bg-muted/30 rounded-cfe border border-border">
        <Button variant="outline" size="sm" onClick={() => onEdit(1)} className="rounded-cfe text-sm hover:bg-accent">
          <Edit3 className="w-4 h-4 mr-2" />
          Editar Datos Personales/Jefe
        </Button>
        <Button variant="outline" size="sm" onClick={() => onEdit(2)} className="rounded-cfe text-sm hover:bg-accent">
          <Edit3 className="w-4 h-4 mr-2" />
          Editar Selección de Sitios
        </Button>
        <Button variant="outline" size="sm" onClick={() => onEdit(3)} className="rounded-cfe text-sm hover:bg-accent">
          <Edit3 className="w-4 h-4 mr-2" />
          Editar Permisos
        </Button>
      </div>

      <div className="space-y-8">
        {/* Datos del Solicitante */}
        <Card className="rounded-cfe shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-cfe-black flex items-center gap-2">
              <User className="w-5 h-5 text-cfe-green" />
              Datos del Solicitante
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <DataRow label="RPE" value={formData.rpe} />
            <DataRow label="Nombre" value={formData.nombre} />
            <DataRow label="Correo Electrónico" value={formData.correo} />
            <Separator className="my-4" />
            <DataRow label="Área/EPS/EF" value={formData.areaEpsEf} />
            <DataRow label="Puesto Solicitante" value={formData.puestoSolicitante} />
          </CardContent>
        </Card>

        {/* Datos del Jefe Inmediato */}
        <Card className="rounded-cfe shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-cfe-black flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-cfe-green" />
              Datos del Jefe Inmediato
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <DataRow label="Nombre Completo del Jefe" value={formData.nombreJefe} />
            <DataRow label="RPE del Jefe" value={formData.rpeJefe} />
            <DataRow label="Puesto del Jefe" value={formData.puestoJefe} />
          </CardContent>
        </Card>

        {/* Sitios/Servicios y Permisos */}
        <Card className="rounded-cfe shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-cfe-black flex items-center gap-2">
              <Settings className="w-5 h-5 text-cfe-green" />
              Sitios/Servicios y Permisos Asignados
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedSitios.length > 0 ? (
              <div className="overflow-x-auto">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="bg-cfe-green-very-light hover:bg-cfe-green-very-light">
                      <TableHead className="font-semibold text-cfe-black border-b-2 border-cfe-green/20">
                        Sitio/Servicio
                      </TableHead>
                      <TableHead className="font-semibold text-cfe-black border-b-2 border-cfe-green/20">
                        Permiso Asignado
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedSitios.map((sitio, index) => (
                      <TableRow key={sitio.id} className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                        <TableCell className="text-foreground font-medium py-4 border-b border-border">
                          {sitio.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground py-4 border-b border-border">
                          {sitio.permiso || "No asignado"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">No hay sitios/servicios seleccionados.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default RevisionResponsiva
