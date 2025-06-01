import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { registrarSolicitudEnExcel } from '../services/excel.service';
import { generateDevWordDocument } from '../services/wordDev.service';
import logger from '../utils/logger';

// Esquema Zod para validación
const solicitudSchema = z.object({
    solicitante: z.object({
        rpe: z.string().min(1, "RPE es requerido"),
        nombre: z.string().min(1, "Nombre es requerido"),
        correo: z.string().email("Correo inválido"),
        areaSeleccionada: z.string().min(1, "Área es requerida"),
        puestoIngresado: z.string().min(1, "Puesto es requerido")
    }),
    jefe: z.object({
        nombre: z.string().min(1, "Nombre del jefe es requerido"),
        rpe: z.string().min(1, "RPE del jefe es requerido"),
        puesto: z.string().min(1, "Puesto del jefe es requerido")
    }),
    sistemasSeleccionados: z.array(
        z.object({
            nombreDelSistema: z.string().min(1, "Nombre del sistema es requerido"),
            rolDelUsuario: z.string().min(1, "Rol del usuario es requerido")
        })
    ).min(1, "Debe seleccionar al menos un sistema"),
    fechaSolicitud: z.string().datetime({ message: "Fecha inválida" })
});

export const registrarSolicitud = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        logger.info('Recibiendo solicitud para registro');

        // Validar payload
        const validationResult = solicitudSchema.safeParse(req.body);

        if (!validationResult.success) {
            logger.warn('Validación de solicitud fallida');
            res.status(400).json({
                success: false,
                errors: validationResult.error.errors
            });
            return;
        }

        // Generar ID único
        const solicitudId = uuidv4();
        const fechaSolicitud = new Date().toISOString();

        // 1. Registrar en Excel (Prioridad)
        await registrarSolicitudEnExcel({
            ...validationResult.data,
            solicitudId,
            fechaSolicitud
        });

        logger.info(`Solicitud ${solicitudId} registrada exitosamente en Excel.`);

        // 2. Generar Word para DEV (Secundario - no bloqueante)
        try {
            const generatedFilePath = await generateDevWordDocument(validationResult.data, solicitudId);
            if (generatedFilePath) {
                logger.info(`Documento Word para DEV generado correctamente: ${generatedFilePath}`);
            } else {
                // El error ya fue logueado dentro de generateDevWordDocument
                logger.warn(`La generación del documento Word para DEV falló para la solicitud ${solicitudId}. El detalle está en los logs anteriores.`);
            }
        } catch (wordError) {
            // Esto debería capturar errores inesperados que generateDevWordDocument no manejó internamente,
            // aunque generateDevWordDocument ya tiene un catch amplio.
            // Loguear, pero NO relanzar.
            const errorObj = wordError instanceof Error ? wordError : new Error(String(wordError));
            logger.error(`Excepción no manejada durante la generación del Word DEV para solicitud ${solicitudId}: ${errorObj.message}`, errorObj);
        }

        // Enviar respuesta de éxito si el registro en Excel fue exitoso
        res.status(201).json({
            success: true,
            message: 'Solicitud registrada exitosamente',
            solicitudId
        });

    } catch (error) {
        // Capturar errores del flujo principal (validación, registro en Excel)
        const errorObj = error instanceof Error ? error : new Error(String(error));
        logger.error('Error en registro de solicitud (flujo principal)', errorObj);
        next(errorObj); // Pasar el error al middleware de manejo de errores global
    }
}; 