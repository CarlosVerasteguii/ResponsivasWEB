"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const solicitud_controller_1 = require("../controllers/solicitud.controller");
const router = (0, express_1.Router)();
router.post('/', solicitud_controller_1.registrarSolicitud);
exports.default = router;
//# sourceMappingURL=solicitud.routes.js.map