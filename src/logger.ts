import log from 'loglevel';

import { logLevel } from './config';

type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'silent';

export function createLogger(name = 'root', level: LogLevel = logLevel as LogLevel) {
  const logger = log.getLogger(name);
  logger.setLevel(level, false);
  return logger;
}

const logger = createLogger();

export default logger;
