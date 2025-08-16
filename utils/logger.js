const fs = require('fs');
const path = require('path');
const appConfig = require('../config/app');

class Logger {
  constructor() {
    this.logLevel = appConfig.logging.level;
    this.logFile = appConfig.logging.file;
    
    // Ensure logs directory exists
    const logDir = path.dirname(this.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }
  
  /**
   * Format log message
   */
  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const metaString = Object.keys(meta).length > 0 ? JSON.stringify(meta) : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${message} ${metaString}\n`;
  }
  
  /**
   * Write log to file and console
   */
  writeLog(level, message, meta = {}) {
    const formattedMessage = this.formatMessage(level, message, meta);
    
    // Write to console
    console.log(formattedMessage.trim());
    
    // Write to file
    try {
      fs.appendFileSync(this.logFile, formattedMessage);
    } catch (error) {
      console.error('Failed to write to log file:', error.message);
    }
  }
  
  /**
   * Log levels
   */
  info(message, meta = {}) {
    this.writeLog('info', message, meta);
  }
  
  error(message, meta = {}) {
    this.writeLog('error', message, meta);
  }
  
  warn(message, meta = {}) {
    this.writeLog('warn', message, meta);
  }
  
  debug(message, meta = {}) {
    if (this.logLevel === 'debug') {
      this.writeLog('debug', message, meta);
    }
  }
}

module.exports = new Logger();