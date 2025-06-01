"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registrarSolicitud = void 0;
const zod_1 = require("zod");
const uuid_1 = require("uuid");
const excel_service_1 = require("../services/excel.service");
const logger_1 = __importDefault(require("../utils/logger"));
const solicitudSchema = zod_1.z.object({
    solicitante: zod_1.z.object({
        rpe: zod_1.z.string().min(1, "RPE es requerido"),
        nombre: zod_1.z.string().min(1, "Nombre es requerido"),
        correo: zod_1.z.string().email("Correo inválido"),
        areaSeleccionada: zod_1.z.string().min(1, "Área es requerida"),
        puestoIngresado: zod_1.z.string().min(1, "Puesto es requerido")
    }),
    jefe: zod_1.z.object({
        nombre: zod_1.z.string().min(1, "Nombre del jefe es requerido"),
        rpe: zod_1.z.string().min(1, "RPE del jefe es requerido"),
        puesto: zod_1.z.string().min(1, "Puesto del jefe es requerido")
    }),
    sistemasSeleccionados: zod_1.z.array(zod_1.z.object({
        nombreDelSistema: zod_1.z.string().min(1, "Nombre del sistema es requerido"),
        rolDelUsuario: zod_1.z.string().min(1, "Rol del usuario es requerido")
    })).min(1, "Debe seleccionar al menos un sistema"),
    fechaSolicitud: zod_1.z.string().datetime({ message: "Fecha inválida" })
});
const registrarSolicitud = async (req, res, next) => {
    try {
        logger_1.default.info('Recibiendo solicitud para registro');
        const validationResult = solicitudSchema.safeParse(req.body);
        if (!validationResult.success) {
            logger_1.default.warn('Validación de solicitud fallida');
            res.status(400).json({
                success: false,
                errors: validationResult.error.errors
            });
            return;
        }
        const solicitudId = (0, uuid_1.v4)();
        const fechaSolicitud = new Date().toISOString();
        await (0, excel_service_1.registrarSolicitudEnExcel)({
            ...validationResult.data,
            solicitudId,
            fechaSolicitud
        });
        logger_1.default.info(`Solicitud ${solicitudId} registrada exitosamente`);
        res.status(201).json({
            success: true,
            message: 'Solicitud registrada exitosamente',
            solicitudId
        });
    }
    catch (error) {
        const errorObj = error instanceof Error ? error : new Error(String(error));
        logger_1.default.error('Error en registro de solicitud', errorObj);
        next(errorObj);
    }
};
exports.registrarSolicitud = registrarSolicitud;
//# sourceMappingURL=solicitud.controller.js.map