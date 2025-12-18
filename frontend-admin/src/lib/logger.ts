/**
 * Centralized logging utility for the application
 * Provides structured logging with different levels
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  error?: Error;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isClient = typeof window !== 'undefined';

  /**
   * Format log entry for better readability
   */
  private formatLogEntry(entry: LogEntry): string {
    const { level, message, timestamp, context } = entry;
    let formatted = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

    if (context && Object.keys(context).length > 0) {
      formatted += `\n  Context: ${JSON.stringify(context, null, 2)}`;
    }

    return formatted;
  }

  /**
   * Log to console based on level
   */
  private logToConsole(entry: LogEntry): void {
    const formatted = this.formatLogEntry(entry);

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(formatted);
        break;
      case LogLevel.INFO:
        console.info(formatted);
        break;
      case LogLevel.WARN:
        console.warn(formatted);
        if (entry.error) console.warn(entry.error);
        break;
      case LogLevel.ERROR:
        console.error(formatted);
        if (entry.error) console.error(entry.error);
        break;
    }
  }

  /**
   * Send log to external service (e.g., Sentry, LogRocket)
   * TODO: Implement external logging service integration
   */
  private async sendToExternalService(entry: LogEntry): Promise<void> {
    // Only send errors and warnings in production
    if (!this.isDevelopment && (entry.level === LogLevel.ERROR || entry.level === LogLevel.WARN)) {
      // TODO: Integrate with external logging service
      // Example: Sentry.captureException(entry.error, { contexts: { custom: entry.context } });
    }
  }

  /**
   * Core logging method
   */
  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    error?: Error,
  ): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
    };

    // Always log to console in development
    if (this.isDevelopment) {
      this.logToConsole(entry);
    }

    // Send to external service in production
    if (!this.isDevelopment && this.isClient) {
      this.sendToExternalService(entry).catch((err) => {
        console.error('Failed to send log to external service:', err);
      });
    }

    // Store critical errors in localStorage for debugging
    if (level === LogLevel.ERROR && this.isClient) {
      this.storeErrorLocally(entry);
    }
  }

  /**
   * Store errors locally for debugging
   */
  private storeErrorLocally(entry: LogEntry): void {
    try {
      const storageKey = 'app_error_logs';
      const stored = localStorage.getItem(storageKey);
      const logs: LogEntry[] = stored ? JSON.parse(stored) : [];

      // Keep only last 50 errors
      logs.push(entry);
      if (logs.length > 50) {
        logs.shift();
      }

      localStorage.setItem(storageKey, JSON.stringify(logs));
    } catch (err) {
      console.error('Failed to store error locally:', err);
    }
  }

  /**
   * Debug level logging
   */
  debug(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * Info level logging
   */
  info(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Warning level logging
   */
  warn(message: string, context?: Record<string, unknown>, error?: Error): void {
    this.log(LogLevel.WARN, message, context, error);
  }

  /**
   * Error level logging
   */
  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  /**
   * API error logging with additional context
   */
  apiError(endpoint: string, error: Error, context?: Record<string, unknown>): void {
    this.error(`API Error: ${endpoint}`, error, {
      endpoint,
      ...context,
    });
  }

  /**
   * Get stored error logs from localStorage
   */
  getStoredErrors(): LogEntry[] {
    if (!this.isClient) return [];

    try {
      const stored = localStorage.getItem('app_error_logs');
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error('Failed to retrieve stored errors:', err);
      return [];
    }
  }

  /**
   * Clear stored error logs
   */
  clearStoredErrors(): void {
    if (!this.isClient) return;

    try {
      localStorage.removeItem('app_error_logs');
    } catch (err) {
      console.error('Failed to clear stored errors:', err);
    }
  }
}

// Export singleton instance
export const logger = new Logger();
