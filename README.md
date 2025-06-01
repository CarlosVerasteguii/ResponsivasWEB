# CFE - Generador de Solicitudes de Responsivas TICSI v1.0 (MVP)

Este repositorio contiene el código fuente del MVP (Producto Mínimo Viable) de la aplicación web para la generación y registro de solicitudes de cartas responsivas del departamento TICSI de CFE.

## Descripción del Proyecto

La aplicación permite a los usuarios (empleados de CFE) completar un formulario en múltiples pasos con sus datos, datos de su jefe inmediato y seleccionar los sistemas/servicios a los que requieren acceso. Una vez enviada la solicitud, el backend la registra en un archivo Excel centralizado para el equipo de TI y genera un documento Word simplificado para uso interno de los desarrolladores.

## Características del MVP (Alcance Actual)

*   **Frontend (React/Next.js):**
    *   Flujo de formulario multi-paso guiado.
    *   Validaciones básicas en el lado del cliente.
    *   Persistencia de datos del formulario entre pasos.
    *   Página de confirmación de solicitud con ID único.
    *   Manejo básico de errores de conexión al backend.
    *   Diseño basado en la guía de estilo CFE (simulado con Tailwind CSS y shadcn/ui).
*   **Backend (Node.js/Express/TypeScript):**
    *   Endpoint POST `/api/solicitudes/registrar` para recibir solicitudes.
    *   Validación robusta del payload de entrada con Zod.
    *   Generación de un ID único (UUID) para cada solicitud.
    *   Registro de los datos completos de la solicitud en una nueva fila en el archivo Excel `server/data/log_solicitudes_responsivas.xlsx` (funcionalidad central del MVP).
    *   Generación de un documento Word simplificado (`SolicitudDev_*.docx`) en la carpeta `server/generated_dev_docs/` utilizando `docxtemplater` para uso interno de devs (esta generación ocurre después del registro en Excel y no bloquea la solicitud principal si falla).
    *   Manejo básico de errores y logging detallado.

## Tecnologías Utilizadas

*   **Frontend:**
    *   React
    *   Next.js
    *   TypeScript
    *   Tailwind CSS
    *   shadcn/ui (Componentes UI)
*   **Backend:**
    *   Node.js
    *   Express
    *   TypeScript
    *   Zod (Validación de esquema)
    *   ExcelJS (Manipulación de Excel)
    *   uuid (Generación de UUIDs)
    *   docxtemplater (Generación de Word)
    *   PizZip (Manejo de archivos ZIP para docx)

## Estructura del Proyecto (Clave)

```
Responsivas FINAL/
├── app/               # Archivos de la aplicación Next.js (páginas, layout)
├── components/        # Componentes reutilizables (UI y específicos de CFE)
├── lib/               # Utilidades y constantes compartidas
├── public/            # Archivos estáticos
├── server/            # Código fuente del backend (Node.js/Express)
│   ├── data/          # Archivos de datos (log_solicitudes_responsivas.xlsx)
│   ├── generated_dev_docs/ # Documentos Word generados para devs
│   ├── src/           # Código fuente TypeScript del backend
│   │   ├── controllers/ # Lógica de manejo de peticiones
│   │   ├── middleware/  # Middlewares (ej. manejo de errores)
│   │   ├── routes/      # Definición de rutas API
│   │   ├── services/    # Lógica de negocio (excel.service.ts, wordDev.service.ts)
│   │   └── utils/       # Utilidades (logger.ts)
│   ├── templates/     # Plantillas de documentos (hope_plantilla_simplificada.docx)
│   └── package.json   # Dependencias del backend
├── styles/            # Archivos CSS globales
├── tailwind.config.ts # Configuración de Tailwind
├── tsconfig.json      # Configuración de TypeScript (Root)
├── package.json       # Dependencias del frontend y scripts principales
└── README.md          # Este archivo
```

## Configuración e Instalación

1.  **Clonar el Repositorio:**
    ```bash
    git clone https://github.com/CarlosVerasteguii/ResponsivasWEB.git
    cd ResponsivasWEB
    ```

2.  **Instalar Dependencias del Frontend:**
    ```bash
    npm install
    # o pnpm install si usas pnpm
    ```

3.  **Instalar Dependencias del Backend:**
    Navega a la carpeta `server` e instala sus dependencias por separado:
    ```bash
    cd server
    npm install
    # o pnpm install si usas pnpm
    cd .. # Regresa a la raíz del proyecto
    ```
    *Nota: Las dependencias `docxtemplater`, `pizzip`, y `@types/pizzip` han sido añadidas al `server/package.json`.*

4.  **Preparar Plantilla Word (Manual):**
    Asegúrate de tener el archivo de plantilla `hope_plantilla_simplificada.docx` dentro de la carpeta `server/templates/`. Si no existe, créala.

## Ejecución del Proyecto

1.  **Iniciar el Servidor Backend:**
    Desde la raíz del proyecto, ejecuta el script `dev:server` definido en `package.json`:
    ```bash
    npm run dev:server
    # o pnpm run dev:server
    ```
    Esto compilará e iniciará el servidor Node.js usando `ts-node` y `nodemon`. El backend escuchará en el puerto configurado (por defecto 5000).

2.  **Iniciar la Aplicación Frontend:**
    Desde una nueva terminal en la raíz del proyecto, ejecuta el script `dev`:
    ```bash
    npm run dev
    # o pnpm run dev
    ```
    Esto iniciará la aplicación Next.js en modo desarrollo (por defecto en `http://localhost:3000`).

## Uso de la Aplicación

1.  Abre tu navegador y ve a `http://localhost:3000`.
2.  Serás redirigido a la página de inicio de sesión. Puedes usar las credenciales de prueba disponibles en la página de login o implementar tu propia lógica de autenticación.
3.  Completa el formulario en el Dashboard siguiendo los pasos indicados.
4.  Al hacer clic en "Enviar Solicitud" en el último paso, la información será enviada al backend.
5.  Verifica en la terminal del backend los logs de registro en Excel y generación del Word de devs.
6.  Revisa las carpetas `server/data/` y `server/generated_dev_docs/` para encontrar los archivos generados.

## Puntos a Considerar (MVP)

*   La persistencia de datos del formulario es solo en el estado del componente, no en `localStorage` ni en el backend antes de la solicitud final.
*   El archivo `log_solicitudes_responsivas.xlsx` no maneja concurrencia de forma avanzada. Para alto volumen, se recomienda una base de datos.
*   La generación del Word de devs es para referencia interna y no tiene el formato final de usuario.
*   La autenticación es simulada.

## Posibles Mejoras Futuras

*   Implementación de autenticación real (ej. con Directorio Activo).
*   Uso de una base de datos (SQL, NoSQL) en lugar del archivo Excel para escalabilidad y concurrencia.
*   Generación del documento Word final para el usuario (con formato CFE, firmas, etc.).
*   Funcionalidad para subir el PDF firmado de la responsiva.
*   Interfaz para que el equipo de TI consulte las solicitudes registradas.
*   Notificaciones (correo electrónico, etc.).

## Autor

*   Carlos Verasteguii

--- 