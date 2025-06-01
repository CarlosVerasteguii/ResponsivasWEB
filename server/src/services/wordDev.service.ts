import fs from 'fs/promises';
import path from 'path';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import logger from '../utils/logger';

// Define the interface for the input data based on the payload structure
interface SolicitudDataForDevWord {
    solicitante: {
        rpe: string;
        nombre: string;
        correo: string;
        areaSeleccionada: string;
        puestoIngresado: string;
    };
    jefe: {
        nombre: string;
        rpe: string;
        puesto: string;
    };
    fechaSolicitud: string;
}

// Helper para obtener el nombre del mes en español
const getMonthName = (monthIndex: number): string => {
    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    return monthNames[monthIndex]; // monthIndex es 0-based
};

// Formatear fecha para {{fch}} "DD de Mes de YYYY" o "" si es inválida
const formatearFechaParaWord = (isoDateString: string): string => {
    try {
        const date = new Date(isoDateString);
        if (isNaN(date.getTime())) {
            logger.warn(`Fecha inválida recibida para formatear (fch): ${isoDateString}`);
            return ""; // Retornar vacío para fecha inválida
        }
        const day = date.getDate();
        const monthName = getMonthName(date.getMonth());
        const year = date.getFullYear();
        return `${day} de ${monthName} de ${year}`;
    } catch (error) {
        logger.error(`Error formateando fecha para fch: ${isoDateString}`, error as Error);
        return ""; // Asegurar retorno vacío en caso de error inesperado
    }
};

// Obtener solo el día para {{df}} "DD" o "" si es inválida
const obtenerDiaDeFecha = (isoDateString: string): string => {
    try {
        const date = new Date(isoDateString);
        if (isNaN(date.getTime())) {
            logger.warn(`Fecha inválida recibida para obtener día (df): ${isoDateString}`);
            return ""; // Retornar vacío para fecha inválida
        }
        const day = date.getDate();
        return day.toString().padStart(2, '0'); // Asegura dos dígitos
    } catch (error) {
        logger.error(`Error obteniendo día de fecha para df: ${isoDateString}`, error as Error);
        return ""; // Asegurar retorno vacío en caso de error inesperado
    }
};

// Obtener solo el mes en texto para {{mf}} "mes" en minúsculas o "" si es inválida
const obtenerMesEnTextoDeFecha = (isoDateString: string): string => {
    try {
        const date = new Date(isoDateString);
        if (isNaN(date.getTime())) {
            logger.warn(`Fecha inválida recibida para obtener mes (mf): ${isoDateString}`);
            return ""; // Retornar vacío para fecha inválida
        }
        const monthName = getMonthName(date.getMonth());
        return monthName.toLowerCase(); // Mes en minúsculas
    } catch (error) {
        logger.error(`Error obteniendo mes de fecha para mf: ${isoDateString}`, error as Error);
        return ""; // Asegurar retorno vacío en caso de error inesperado
    }
};

export async function generateDevWordDocument(data: SolicitudDataForDevWord, solicitudId: string): Promise<string | null> {
    try {
        logger.info(`Iniciando generación de documento Word para DEV (ID: ${solicitudId})`);

        // 2. Construir la Ruta a la Plantilla de Forma Robusta
        const templatePath = path.resolve(__dirname, '..', '..', 'templates', 'hope_plantilla_simplificada.docx');
        logger.info(`Ruta de plantilla resuelta: ${templatePath}`);

        // Verificar si la plantilla existe
        try {
            await fs.access(templatePath);
            logger.info('Plantilla encontrada.');
        } catch (error) {
            logger.error(`Plantilla no encontrada en: ${templatePath}`, error as Error);
            throw new Error(`Plantilla Word no encontrada: ${templatePath}`);
        }

        // Cargar la plantilla
        const content = await fs.readFile(templatePath, 'binary');
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
            delimiters: { start: '{{', end: '}}' },
            // nullGetter is not specified, defaults to replacing non-found tags with empty string
        });

        // 4. Preparar el Objeto dataForTemplate
        const dataForTemplate = {
            rp: data.solicitante.rpe ? data.solicitante.rpe.toUpperCase() : "", // {{rp}}
            usr: data.solicitante.nombre || "",             // {{usr}}
            fch: formatearFechaParaWord(data.fechaSolicitud), // {{fch}}
            eml: data.solicitante.correo || "",             // {{eml}}
            ar: data.solicitante.areaSeleccionada || "",   // {{ar}}
            pst: data.solicitante.puestoIngresado || "",  // {{pst}}
            df: obtenerDiaDeFecha(data.fechaSolicitud),     // {{df}}
            mf: obtenerMesEnTextoDeFecha(data.fechaSolicitud), // {{mf}}
            nj: data.jefe.nombre || "",                   // {{nj}}
            rj: data.jefe.rpe ? data.jefe.rpe.toUpperCase() : "",  // {{rj}}
            pj: data.jefe.puesto || "",                     // {{pj}}
            // s1-s5 and fs are intentionally omitted
        };

        logger.info(`Datos para Docxtemplater (Word DEVS) ANTES de setData: ${JSON.stringify(dataForTemplate, null, 2)}`);

        // Establecer los datos en el documento
        doc.setData(dataForTemplate);

        // Renderizar el documento (rellenar placeholders)
        doc.render();

        // Generar el buffer del documento
        const buffer = doc.getZip().generate({
            type: 'nodebuffer',
            compression: 'DEFLATE', // Comprimir el archivo
        });

        // 5. Almacenamiento y Nomenclatura del Word Generado
        const outputDir = path.resolve(__dirname, '..', '..', 'generated_dev_docs');

        // Crear el directorio de salida si no existe
        await fs.mkdir(outputDir, { recursive: true });
        logger.info(`Directorio de salida verificado/creado: ${outputDir}`);

        // Generar nombre del archivo (usando fecha/hora de generación actual, no de la solicitud)
        const now = new Date();
        const timestamp = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;

        // Usar RPE del solicitante para el nombre del archivo (ya está en mayúsculas en dataForTemplate)
        const solicitanteRpe = dataForTemplate.rp || "unknownRPE";
        const outputFileName = `SolicitudDev_${solicitanteRpe}_${solicitudId}_${timestamp}.docx`;
        const outputPath = path.join(outputDir, outputFileName);
        logger.info(`Ruta de salida del archivo: ${outputPath}`);

        // Guardar el archivo
        await fs.writeFile(outputPath, buffer);
        logger.info(`Documento Word para DEV generado y guardado exitosamente: ${outputPath}`);

        return outputPath; // Retornar la ruta del archivo generado en caso de éxito

    } catch (error) {
        // 7. Manejo de Errores: Loguear detalladamente pero no relanzar
        const errorObj = error instanceof Error ? error : new Error(String(error));
        logger.error(`Error generando documento Word para DEV (ID: ${solicitudId}): ${errorObj.message}`, errorObj);

        // No relanzar el error, para no afectar el flujo principal del controlador
        return null; // Indicar fallo en la generación del Word
    }
} 