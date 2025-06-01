"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LogLevel;
(function (LogLevel) {
    LogLevel["INFO"] = "INFO";
    LogLevel["WARN"] = "WARN";
    LogLevel["ERROR"] = "ERROR";
    LogLevel["DEBUG"] = "DEBUG";
})(LogLevel || (LogLevel = {}));
class Logger {
    formatMessage(level, message) {
        const timestamp = new Date().toISOString();
        return `[${timestamp}] [${level}] ${message}`;
    }
    info(message) {
        console.log(this.formatMessage(LogLevel.INFO, message));
    }
    warn(message) {
        console.warn(this.formatMessage(LogLevel.WARN, message));
    }
    error(message, error) {
        console.error(this.formatMessage(LogLevel.ERROR, message), error ? error.stack : '');
    }
    debug(message) {
        console.debug(this.formatMessage(LogLevel.DEBUG, message));
    }
}
exports.default = new Logger();
//# sourceMappingURL=logger.js.map