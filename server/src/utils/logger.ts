// Simple logger basado en console con niveles de log
enum LogLevel {
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
    DEBUG = 'DEBUG'
}

class Logger {
    private formatMessage(level: LogLevel, message: string): string {
        const timestamp = new Date().toISOString();
        return `[${timestamp}] [${level}] ${message}`;
    }

    info(message: string): void {
        console.log(this.formatMessage(LogLevel.INFO, message));
    }

    warn(message: string): void {
        console.warn(this.formatMessage(LogLevel.WARN, message));
    }

    error(message: string, error?: Error): void {
        console.error(
            this.formatMessage(LogLevel.ERROR, message),
            error ? error.stack : ''
        );
    }

    debug(message: string): void {
        console.debug(this.formatMessage(LogLevel.DEBUG, message));
    }
}

export default new Logger(); 