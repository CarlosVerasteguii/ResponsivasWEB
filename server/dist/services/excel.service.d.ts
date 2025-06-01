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
export declare function registrarSolicitudEnExcel(data: SolicitudData): Promise<void>;
//# sourceMappingURL=excel.service.d.ts.map