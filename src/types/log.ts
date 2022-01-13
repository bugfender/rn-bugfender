/**
 * Log Levels
 *
 * Check the main README to see how to access the `LogLevel` enum.
 */
export enum LogLevel {
  Debug = 0,
  Warning = 1,
  Error = 2,
  Trace = 3,
  Info = 4,
  Fatal = 5,
}

/**
 * @hidden
 */
export const LOG_LEVELS: LogLevel[] = [
  LogLevel.Debug,
  LogLevel.Warning,
  LogLevel.Error,
  LogLevel.Trace,
  LogLevel.Info,
  LogLevel.Fatal,
];

/**
 * @hidden
 */
export interface ILogEntryShort {
  x: string; // Date ISO
  t: string; // Text
  m: string; // Method
  at: number; // Absolute Time
  tg: string; // Tag
  f: string; // File
  l: number; // Line
  ll: number; // Level
  u: string; // URL
}

/**
 * Log Entry object interface
 */
export interface ILogEntry {
  /** The line number where the log was triggered from */
  line?: number;

  /** The log's level based on LogLevel constant */
  level?: LogLevel;

  /** The log's tag */
  tag?: string;

  /** The method name where the log was triggered from */
  method?: string;

  /** The file name where the log was triggered from */
  file?: string;

  /** The log's text content */
  text?: string;

  /** The log's origin URL. This attribute is ignored on Android & iOS */
  url?: string;
}
