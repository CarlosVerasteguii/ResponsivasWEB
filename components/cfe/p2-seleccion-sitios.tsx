"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SITIOS_SERVICIOS_DISPONIBLES, type SitioSeleccionado } from "@/lib/constants"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Info,
  ListX,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MousePointer,
  FileText,
  CheckCircle,
  Download,
  Upload,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface SeleccionSitiosProps {
  selectedSitios: SitioSeleccionado[]
  setSelectedSitios: React.Dispatch<React.SetStateAction<SitioSeleccionado[]>>
}

const SeleccionSitios: React.FC<SeleccionSitiosProps> = ({ selectedSitios, setSelectedSitios }) => {
  const [availableFilter, setAvailableFilter] = useState("")
  const [tempSelectedAvailable, setTempSelectedAvailable] = useState<string[]>([])
  const [tempSelectedChosen, setTempSelectedChosen] = useState<string[]>([])
  const [isHelpOpen, setIsHelpOpen] = useState(false)

  const availableSitios = useMemo(() => {
    return SITIOS_SERVICIOS_DISPONIBLES.filter((s) => !selectedSitios.find((ss) => ss.id === s.id)).filter(
      (s) =>
        s.name.toLowerCase().includes(availableFilter.toLowerCase()) ||
        s.description.toLowerCase().includes(availableFilter.toLowerCase()),
    )
  }, [selectedSitios, availableFilter])

  const handleToggleTempSelection = (list: "available" | "chosen", id: string) => {
    if (list === "available") {
      setTempSelectedAvailable((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
    } else {
      setTempSelectedChosen((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
    }
  }

  const moveSelectedToChosen = () => {
    const toMove = SITIOS_SERVICIOS_DISPONIBLES.filter((s) => tempSelectedAvailable.includes(s.id))
    setSelectedSitios((prev) => [...prev, ...toMove])
    setTempSelectedAvailable([])
  }

  const moveAllToChosen = () => {
    setSelectedSitios(SITIOS_SERVICIOS_DISPONIBLES.map((s) => ({ ...s })))
    setTempSelectedAvailable([])
  }

  const moveSelectedToAvailable = () => {
    setSelectedSitios((prev) => prev.filter((s) => !tempSelectedChosen.includes(s.id)))
    setTempSelectedChosen([])
  }

  const moveAllToAvailable = () => {
    setSelectedSitios([])
    setTempSelectedChosen([])
  }

  const ListItem: React.FC<{
    sitio: SitioSeleccionado
    selected: boolean
    onClick: () => void
    showDescription?: boolean
  }> = ({ sitio, selected, onClick, showDescription = true }) => (
    <div
      onClick={onClick}
      className={cn(
        "p-4 border-b border-border cursor-pointer hover:bg-accent transition-colors duration-150",
        selected && "bg-cfe-green/10 border-l-4 border-l-cfe-green",
      )}
    >
      <p className="font-medium text-sm text-foreground">{sitio.name}</p>
      {showDescription && <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{sitio.description}</p>}
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-cfe-black mb-4">Seleccione los Sitios/Servicios Requeridos</h2>

        {/* Instrucciones mejoradas con iconos */}
        <div className="bg-cfe-green-very-light p-6 rounded-cfe border border-cfe-green/30 text-left max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-cfe-green mb-4 flex items-center justify-center">
            <Info className="w-6 h-6 mr-3" />📋 Instrucciones Rápidas
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-foreground">
            {/* Columna izquierda */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-cfe-green text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <div>
                  <p className="font-semibold">👆 Seleccione sitios</p>
                  <p>Haga clic en los sitios que necesita (panel izquierdo)</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-cfe-green text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div>
                  <p className="font-semibold">➡️ Use los botones</p>
                  <p>Mueva los sitios al panel derecho con los botones centrales</p>
                </div>
              </div>
            </div>

            {/* Columna derecha */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-cfe-green text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <div>
                  <p className="font-semibold">🔍 Use el buscador</p>
                  <p>Escriba para encontrar sitios específicos más rápido</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-cfe-green text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg">
                  4
                </div>
                <div>
                  <p className="font-semibold">✅ Verifique su lista</p>
                  <p>El panel derecho muestra lo que aparecerá en su responsiva</p>
                </div>
              </div>
            </div>
          </div>

          {/* Botones explicados visualmente */}
          <div className="mt-6 p-4 bg-white rounded border border-cfe-green/20">
            <h4 className="font-semibold text-cfe-green mb-3 flex items-center">
              <MousePointer className="w-4 h-4 mr-2" />
              Significado de los Botones Centrales:
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="text-center">
                <ChevronRight className="w-6 h-6 mx-auto text-cfe-green mb-1" />
                <p className="font-medium">→</p>
                <p>Mover seleccionados</p>
              </div>
              <div className="text-center">
                <ChevronsRight className="w-6 h-6 mx-auto text-cfe-green mb-1" />
                <p className="font-medium">→→</p>
                <p>Mover todos</p>
              </div>
              <div className="text-center">
                <ChevronLeft className="w-6 h-6 mx-auto text-cfe-green mb-1" />
                <p className="font-medium">←</p>
                <p>Quitar seleccionados</p>
              </div>
              <div className="text-center">
                <ChevronsLeft className="w-6 h-6 mx-auto text-cfe-green mb-1" />
                <p className="font-medium">←←</p>
                <p>Quitar todos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sección expandible de ayuda detallada */}
        <div className="mt-4 max-w-4xl mx-auto">
          <Collapsible open={isHelpOpen} onOpenChange={setIsHelpOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className="w-full md:w-auto bg-background hover:bg-accent border-cfe-green text-cfe-green font-semibold"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                {isHelpOpen ? "Ocultar" : "Ver"} Guía Completa del Sistema
                {isHelpOpen ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <div className="bg-background border border-border rounded-cfe p-6 text-left shadow-lg">
                <h3 className="text-lg font-bold text-cfe-black mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-cfe-green" />🎯 Guía Completa: Cómo Generar su Responsiva CFE
                </h3>

                <div className="space-y-6 text-sm">
                  {/* Paso 1 */}
                  <div className="border-l-4 border-cfe-green pl-4">
                    <h4 className="font-semibold text-cfe-green mb-2">📝 PASO 1: Datos Personales (Actual: Paso 2)</h4>
                    <p className="text-muted-foreground">
                      Ya completó sus datos personales y de su jefe inmediato. Esta información aparecerá en el
                      documento final.
                    </p>
                  </div>

                  {/* Paso 2 */}
                  <div className="border-l-4 border-yellow-500 pl-4 bg-yellow-50 p-3 rounded">
                    <h4 className="font-semibold text-yellow-700 mb-2">🎯 PASO 2: Selección de Sitios (PASO ACTUAL)</h4>
                    <div className="space-y-2 text-foreground">
                      <p>
                        <strong>¿Qué está haciendo ahora?</strong> Eligiendo los sistemas de CFE que necesita para su
                        trabajo.
                      </p>
                      <p>
                        <strong>¿Por qué es importante?</strong> Solo tendrá acceso a los sitios que seleccione aquí.
                      </p>
                      <p>
                        <strong>Consejo:</strong> Es mejor seleccionar todos los que pueda necesitar. Agregar más
                        después requiere una nueva responsiva.
                      </p>
                    </div>
                  </div>

                  {/* Paso 3 */}
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold text-blue-600 mb-2">🔐 PASO 3: Asignación de Permisos (Siguiente)</h4>
                    <p className="text-muted-foreground">
                      Después de seleccionar sitios, elegirá qué tipo de acceso necesita en cada uno (lectura, edición,
                      administración, etc.).
                    </p>
                  </div>

                  {/* Paso 4 */}
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-semibold text-purple-600 mb-2">👀 PASO 4: Revisión Final</h4>
                    <p className="text-muted-foreground">
                      Verificará toda la información antes de generar el documento Word que deberá imprimir y firmar.
                    </p>
                  </div>

                  {/* Proceso después */}
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-semibold text-orange-600 mb-2">📄 Después de Generar el Documento</h4>
                    <div className="space-y-1 text-muted-foreground">
                      <p className="flex items-center">
                        <Download className="w-4 h-4 mr-2" /> 1. Se descargará un archivo Word
                      </p>
                      <p className="flex items-center">
                        <FileText className="w-4 h-4 mr-2" /> 2. Imprímalo y fírmelo
                      </p>
                      <p className="flex items-center">
                        <Upload className="w-4 h-4 mr-2" /> 3. Escanéelo y súbalo al sistema
                      </p>
                      <p className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" /> 4. TI procesará su solicitud
                      </p>
                    </div>
                  </div>

                  <div className="bg-highlight-yellow p-3 rounded border border-yellow-300">
                    <p className="text-foreground font-medium">
                      💡 <strong>Tip importante:</strong> Tómese su tiempo en este paso. Una vez que genere el
                      documento, no podrá modificar la lista de sitios sin crear una nueva responsiva.
                    </p>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>

      {/* Indicador de progreso visual */}
      <div className="flex justify-center mb-6">
        <div className="bg-background border border-border rounded-cfe p-4 shadow-sm">
          <p className="text-sm text-muted-foreground text-center">
            Sitios seleccionados: <span className="font-bold text-cfe-green text-lg">{selectedSitios.length}</span>
            {selectedSitios.length === 0 && " (Debe seleccionar al menos 1)"}
            {selectedSitios.length > 0 && " ✅"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 items-start">
        {/* Panel Izquierdo: Sitios Disponibles */}
        <Card className="rounded-cfe shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-cfe-black flex items-center gap-2">
              <span className="bg-cfe-green text-cfe-text-on-green rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                1
              </span>
              📋 Elija de la Lista de Sitios/Servicios Disponibles
            </CardTitle>
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="🔍 Filtrar/Buscar sitios..."
                value={availableFilter}
                onChange={(e) => setAvailableFilter(e.target.value)}
                className="pl-10 bg-input border-border rounded-cfe focus:ring-2 focus:ring-cfe-green focus:border-cfe-green"
              />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ScrollArea className="h-80 border border-border rounded-cfe bg-background">
              {availableSitios.length > 0 ? (
                availableSitios.map((sitio) => (
                  <ListItem
                    key={sitio.id}
                    sitio={sitio}
                    selected={tempSelectedAvailable.includes(sitio.id)}
                    onClick={() => handleToggleTempSelection("available", sitio.id)}
                  />
                ))
              ) : (
                <div className="p-8 text-center">
                  <ListX className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    {availableFilter ? "No hay sitios que coincidan con el filtro." : "No hay sitios disponibles."}
                  </p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Botones de Transferencia con Tooltips */}
        <TooltipProvider>
          <div className="flex flex-col space-y-3 self-center mt-8 lg:mt-0">
            <div className="text-center mb-2">
              <Info className="w-4 h-4 text-muted-foreground mx-auto" />
              <p className="text-xs text-muted-foreground mt-1">Controles</p>
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={moveSelectedToChosen}
                  disabled={tempSelectedAvailable.length === 0}
                  className="rounded-cfe border-border hover:bg-accent focus:ring-2 focus:ring-cfe-green h-10 w-10"
                >
                  <ChevronRight className="h-5 w-5 text-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Añadir sitios seleccionados a su responsiva</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={moveAllToChosen}
                  disabled={availableSitios.length === 0}
                  className="rounded-cfe border-border hover:bg-accent focus:ring-2 focus:ring-cfe-green h-10 w-10"
                >
                  <ChevronsRight className="h-5 w-5 text-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Añadir todos los sitios disponibles a su responsiva</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={moveSelectedToAvailable}
                  disabled={tempSelectedChosen.length === 0}
                  className="rounded-cfe border-border hover:bg-accent focus:ring-2 focus:ring-cfe-green h-10 w-10"
                >
                  <ChevronLeft className="h-5 w-5 text-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Quitar sitios seleccionados de su responsiva</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={moveAllToAvailable}
                  disabled={selectedSitios.length === 0}
                  className="rounded-cfe border-border hover:bg-accent focus:ring-2 focus:ring-cfe-green h-10 w-10"
                >
                  <ChevronsLeft className="h-5 w-5 text-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Quitar todos los sitios de su responsiva</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>

        {/* Panel Derecho: Sitios Seleccionados */}
        <Card className="rounded-cfe shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-cfe-black flex items-center gap-2">
              <span className="bg-cfe-green text-cfe-text-on-green rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                2
              </span>
              ✅ Sitios/Servicios que se Incluirán en su Responsiva
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ScrollArea className="h-80 border border-border rounded-cfe bg-background">
              {selectedSitios.length > 0 ? (
                selectedSitios.map((sitio) => (
                  <ListItem
                    key={sitio.id}
                    sitio={sitio}
                    selected={tempSelectedChosen.includes(sitio.id)}
                    onClick={() => handleToggleTempSelection("chosen", sitio.id)}
                    showDescription={false}
                  />
                ))
              ) : (
                <div className="p-8 text-center">
                  <ListX className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground font-medium">No hay sitios seleccionados</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    👈 Use los controles de la izquierda para añadir sitios a su responsiva
                  </p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SeleccionSitios
