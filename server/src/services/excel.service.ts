import { Workbook } from 'exceljs';
import fs from 'fs/promises';
import path from 'path';
import logger from '../utils/logger'; // Asegúrate de que el logger esté configurado correctamente

const EXCEL_FILE_PATH = path.join(__dirname, '../../data/log_solicitudes_responsivas.xlsx');

export interface SolicitudData {
    solicitudId: string;
    fechaSolicitud: string;
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
    sistemasSeleccionados: {
        nombreDelSistema: string;
        rolDelUsuario: string;
    }[];
}

export async function registrarSolicitudEnExcel(data: SolicitudData): Promise<void> {
    try {
        logger.info('Intentando escribir solicitud en Excel');
        logger.info(`Datos recibidos: ${JSON.stringify(data, null, 2)}`);

        // Verificar/crear directorio de datos
        await fs.mkdir(path.dirname(EXCEL_FILE_PATH), { recursive: true });

        const workbook = new Workbook();
        let worksheet;
        let isNewFile = false;

        try {
            // Intentar cargar el archivo existente
            logger.info(`Intentando cargar archivo existente: ${EXCEL_FILE_PATH}`);
            await workbook.xlsx.readFile(EXCEL_FILE_PATH);
            worksheet = workbook.getWorksheet('Solicitudes');

            if (!worksheet) {
                logger.info('Worksheet "Solicitudes" no encontrada, creando nueva...');
                worksheet = workbook.addWorksheet('Solicitudes');
                isNewFile = true;
            } else {
                logger.info(`Worksheet "Solicitudes" encontrada. Filas actuales: ${worksheet.rowCount}`);
            }
        } catch (error) {
            // Si el archivo no existe, crear uno nuevo
            logger.info('Archivo no existe, creando nuevo archivo Excel...');
            worksheet = workbook.addWorksheet('Solicitudes');
            isNewFile = true;
        }

        // Configurar columnas si es un archivo nuevo
        if (isNewFile) {
            logger.info('Configurando columnas para archivo nuevo...');
            worksheet.columns = [
                { header: 'ID Solicitud', key: 'solicitudId' },
                { header: 'Fecha Solicitud', key: 'fechaSolicitud' },
                { header: 'RPE Solicitante', key: 'rpeSolicitante' },
                { header: 'Nombre Solicitante', key: 'nombreSolicitante' },
                { header: 'Correo Solicitante', key: 'correoSolicitante' },
                { header: 'Área Solicitante', key: 'areaSolicitante' },
                { header: 'Puesto Solicitante', key: 'puestoSolicitante' },
                { header: 'Nombre Jefe', key: 'nombreJefe' },
                { header: 'RPE Jefe', key: 'rpeJefe' },
                { header: 'Puesto Jefe', key: 'puestoJefe' },
                { header: 'Sistemas y Roles Solicitados', key: 'sistemasRoles' }
            ];
            logger.info('Columnas configuradas correctamente');
        }

        // Formatear cada sistema y rol como elementos separados
        const sistemasFormateados = data.sistemasSeleccionados.map(sistema =>
            `${sistema.nombreDelSistema} (${sistema.rolDelUsuario})`
        );

        logger.info(`Sistemas formateados individualmente: ${JSON.stringify(sistemasFormateados, null, 2)}`);

        // Preparar datos de la fila como ARRAY
        // Primeros 10 campos fijos, luego cada sistema en su propia celda
        const rowValues = [
            data.solicitudId,
            data.fechaSolicitud,
            data.solicitante.rpe,
            data.solicitante.nombre,
            data.solicitante.correo,
            data.solicitante.areaSeleccionada,
            data.solicitante.puestoIngresado,
            data.jefe.nombre,
            data.jefe.rpe,
            data.jefe.puesto,
            // Cada sistema va en su propia celda
            ...sistemasFormateados
        ];

        logger.info(`Valores de la fila a insertar (array): ${JSON.stringify(rowValues, null, 2)}`);
        logger.info(`Número de filas antes de insertar: ${worksheet.rowCount}`);
        logger.info(`Total de valores en la fila: ${rowValues.length} (10 campos fijos + ${sistemasFormateados.length} sistemas)`);

        // Añadir nueva fila usando ARRAY
        const newRow = worksheet.addRow(rowValues);
        logger.info(`Nueva fila añadida. Número de fila: ${newRow.number}`);
        logger.info(`Número de filas después de insertar: ${worksheet.rowCount}`);

        // Log de los valores de las celdas de la nueva fila para debugging
        logger.info(`Valores de la nueva fila:`);
        newRow.eachCell((cell, colNumber) => {
            logger.info(`  Columna ${colNumber}: ${cell.value}`);
        });

        // Guardar archivo
        logger.info(`Guardando archivo en: ${EXCEL_FILE_PATH}`);
        await workbook.xlsx.writeFile(EXCEL_FILE_PATH);
        logger.info(`Solicitud ${data.solicitudId} registrada exitosamente en Excel`);
        logger.info(`Archivo guardado correctamente`);
    } catch (error) {
        const errorObj = error instanceof Error ? error : new Error(String(error));
        logger.error('Error al registrar solicitud en Excel', errorObj);
        throw errorObj;
    }
}
