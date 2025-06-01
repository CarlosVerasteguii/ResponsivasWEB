"use client"

import type React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type SitioSeleccionado, TIPOS_PERMISO } from "@/lib/constants"
import { Label } from "@/components/ui/label"
import { Settings, ListX } from "lucide-react"

interface AsignarPermisosProps {
  selectedSitios: SitioSeleccionado[]
  setSelectedSitios: React.Dispatch<React.SetStateAction<SitioSeleccionado[]>>
}

const AsignarPermisos: React.FC<AsignarPermisosProps> = ({ selectedSitios, setSelectedSitios }) => {
  const handlePermisoChange = (sitioId: string, permiso: string) => {
    setSelectedSitios((prev) => prev.map((s) => (s.id === sitioId ? { ...s, permiso } : s)))
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-cfe-black mb-2">Asigne Permisos a los Sitios Seleccionados</h2>
        <p className="text-sm text-muted-foreground">
          Configure el nivel de acceso que necesita para cada sitio o servicio en su responsiva.
        </p>
      </div>

      <Card className="rounded-cfe shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-cfe-black flex items-center gap-2">
            <Settings className="w-5 h-5 text-cfe-green" />
            Asigne un Tipo de Permiso a Cada Sitio Seleccionado
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedSitios.length === 0 ? (
            <div className="text-center py-12">
              <ListX className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-muted-foreground mb-2">
                No hay sitios seleccionados para asignar permisos
              </p>
              <p className="text-sm text-muted-foreground">
                Regrese al paso anterior para seleccionar sitios y servicios.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Información de ayuda */}
              <div className="bg-cfe-green-very-light p-4 rounded-cfe border border-cfe-green/30">
                <h4 className="font-semibold text-cfe-green mb-2 flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  Información sobre Tipos de Permiso
                </h4>
                <div className="text-sm text-foreground space-y-1">
                  <p>
                    <strong>Usuario Estándar:</strong> Acceso básico de lectura y uso normal
                  </p>
                  <p>
                    <strong>Lector Avanzado:</strong> Puede ver información detallada adicional
                  </p>
                  <p>
                    <strong>Colaborador:</strong> Puede crear y editar contenido básico
                  </p>
                  <p>
                    <strong>Gestor de Contenido:</strong> Administra documentos y contenido
                  </p>
                  <p>
                    <strong>Administrador Parcial:</strong> Permisos administrativos limitados
                  </p>
                </div>
              </div>

              {/* Contador de sitios */}
              <div className="text-center p-3 bg-background border border-border rounded-cfe">
                <p className="text-sm text-muted-foreground">
                  Configurando permisos para <span className="font-bold text-cfe-green">{selectedSitios.length}</span>{" "}
                  sitios seleccionados
                </p>
              </div>

              {/* Lista de sitios con scroll mejorado */}
              <div className="max-h-[600px] overflow-y-auto border border-border rounded-cfe bg-background">
                <div className="p-4 space-y-6">
                  {selectedSitios.map((sitio, index) => (
                    <div
                      key={sitio.id}
                      className="p-6 border border-border rounded-cfe bg-muted/30 hover:bg-muted/50 transition-colors duration-150"
                    >
                      {/* Encabezado del sitio */}
                      <div className="mb-4">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-semibold text-foreground text-lg leading-tight">{sitio.name}</h4>
                          <span className="text-sm bg-cfe-green text-cfe-text-on-green px-4 py-1 rounded-full font-medium">
                            Sitio #{index + 1}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed bg-background p-3 rounded border">
                          {sitio.description}
                        </p>
                      </div>

                      {/* Selector de permiso */}
                      <div className="space-y-3">
                        <Label className="font-semibold text-foreground text-base">
                          Seleccione el Tipo de Permiso Necesario: <span className="text-cfe-green font-bold">*</span>
                        </Label>
                        <Select
                          value={sitio.permiso || "Usuario Estándar"}
                          onValueChange={(value) => handlePermisoChange(sitio.id, value)}
                        >
                          <SelectTrigger className="w-full h-12 bg-input border-border rounded-cfe focus:ring-2 focus:ring-cfe-green focus:border-cfe-green text-base">
                            <SelectValue placeholder="Haga clic aquí para seleccionar un permiso" />
                          </SelectTrigger>
                          <SelectContent className="rounded-cfe bg-popover border-border shadow-lg">
                            {TIPOS_PERMISO.map((permiso) => (
                              <SelectItem
                                key={permiso}
                                value={permiso}
                                className="hover:bg-accent hover:text-accent-foreground cursor-pointer py-3 text-base"
                              >
                                {permiso}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Indicador de scroll si hay muchos elementos */}
              {selectedSitios.length > 3 && (
                <div className="text-center text-sm text-muted-foreground bg-highlight-yellow p-2 rounded border">
                  💡 <strong>Tip:</strong> Use la rueda del mouse o las flechas para desplazarse y ver todos los sitios
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default AsignarPermisos
