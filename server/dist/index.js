"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_1 = __importDefault(require("./config/config"));
const solicitud_routes_1 = __importDefault(require("./routes/solicitud.routes"));
const errorHandler_1 = require("./middleware/errorHandler");
const logger_1 = __importDefault(require("./utils/logger"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/solicitudes', solicitud_routes_1.default);
app.use(errorHandler_1.errorHandler);
app.listen(config_1.default.PORT, () => {
    logger_1.default.info(`Servidor corriendo en http://localhost:${config_1.default.PORT}`);
});
//# sourceMappingURL=index.js.map