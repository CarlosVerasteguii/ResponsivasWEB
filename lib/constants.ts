export const STEPS_RESPONSIVA = [
  { id: 1, name: "Datos Personales" },
  { id: 2, name: "Selección de Sitios" },
  { id: 3, name: "Permisos" },
  { id: 4, name: "Revisión Final" },
]

export const AREAS_EPS_EF = ["TI", "Administración", "Jurídico", "Operaciones", "Finanzas"]

export const SITIOS_SERVICIOS_DISPONIBLES = [
  { id: "s001", name: "Portal Interno CFE", description: "Acceso a noticias y documentos internos de la empresa." },
  {
    id: "s002",
    name: "Sistema de Nómina (SINO)",
    description: "Consulta y gestión de información de nómina personal.",
  },
  {
    id: "s003",
    name: "Gestor Documental (GEDO)",
    description: "Almacenamiento y versionado de documentos corporativos.",
  },
  {
    id: "s004",
    name: "Plataforma de Capacitación (CAPACITA)",
    description: "Cursos y material de formación continua.",
  },
  {
    id: "s005",
    name: "Sistema de Incidencias TI (SITI)",
    description: "Reporte y seguimiento de tickets de soporte técnico.",
  },
  { id: "s006", name: "Red Interna (Intranet)", description: "Acceso general a recursos de red corporativa." },
  { id: "s007", name: "Correo Electrónico Institucional", description: "Uso de la cuenta de correo electrónico CFE." },
  {
    id: "s008",
    name: "Sistema de Recursos Humanos (SIRH)",
    description: "Gestión de información de personal y recursos humanos.",
  },
  {
    id: "s009",
    name: "Portal de Proveedores",
    description: "Acceso al sistema de gestión de proveedores y licitaciones.",
  },
  {
    id: "s010",
    name: "Sistema de Control de Activos",
    description: "Inventario y control de activos fijos de la empresa.",
  },
]

export const TIPOS_PERMISO = [
  "Usuario Estándar",
  "Lector Avanzado",
  "Colaborador",
  "Gestor de Contenido",
  "Administrador Parcial",
]

export interface UserData {
  rpe: string
  nombre: string
  correo: string
  areaEpsEf: string
  puestoSolicitante: string
  nombreJefe: string
  rpeJefe: string
  puestoJefe: string
}

export interface SitioSeleccionado {
  id: string
  name: string
  description: string
  permiso?: string
}
