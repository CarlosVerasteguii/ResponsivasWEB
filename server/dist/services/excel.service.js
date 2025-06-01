"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registrarSolicitudEnExcel = registrarSolicitudEnExcel;
const exceljs_1 = require("exceljs");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const logger_1 = __importDefault(require("../utils/logger"));
const EXCEL_FILE_PATH = path_1.default.join(__dirname, '../../data/log_solicitudes_responsivas.xlsx');
async function registrarSolicitudEnExcel(data) {
    try {
        logger_1.default.info('Intentando escribir solicitud en Excel');
        await promises_1.default.mkdir(path_1.default.dirname(EXCEL_FILE_PATH), { recursive: true });
        const workbook = new exceljs_1.Workbook();
        let worksheet;
        try {
            await workbook.xlsx.readFile(EXCEL_FILE_PATH);
            worksheet = workbook.getWorksheet('Solicitudes') || workbook.addWorksheet('Solicitudes');
        }
        catch {
            worksheet = workbook.addWorksheet('Solicitudes');
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
        }
        const sistemasRoles = data.sistemasSeleccionados
            .map(sistema => `${sistema.nombreDelSistema} (${sistema.rolDelUsuario})`)
            .join('; ');
        worksheet.addRow({
            solicitudId: data.solicitudId,
            fechaSolicitud: data.fechaSolicitud,
            rpeSolicitante: data.solicitante.rpe,
            nombreSolicitante: data.solicitante.nombre,
            correoSolicitante: data.solicitante.correo,
            areaSolicitante: data.solicitante.areaSeleccionada,
            puestoSolicitante: data.solicitante.puestoIngresado,
            nombreJefe: data.jefe.nombre,
            rpeJefe: data.jefe.rpe,
            puestoJefe: data.jefe.puesto,
            sistemasRoles
        });
        await workbook.xlsx.writeFile(EXCEL_FILE_PATH);
        logger_1.default.info(`Solicitud ${data.solicitudId} registrada exitosamente en Excel`);
    }
    catch (error) {
        const errorObj = error instanceof Error ? error : new Error(String(error));
        logger_1.default.error('Error al registrar solicitud en Excel', errorObj);
        throw errorObj;
    }
}
//# sourceMappingURL=excel.service.js.map