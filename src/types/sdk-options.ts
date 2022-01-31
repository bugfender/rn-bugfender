export interface ISDKOptions {
  /** The app key to log into */
  appKey: string;
  /** Base URL to Bugfender API */
  apiURL?: string;
  /** Base URL to Bugfender web dashboard */
  baseURL?: string;
  /** Override default `window.console` so it also logs to Bugfender. Defaults to `true`. */
  overrideConsoleMethods?: boolean;
  /** Logs all logs written via Logcat (Android specific, won't have any effect on iOS). Defaults to `false`. */
  enableLogcatLogging?: boolean;
  /** Boolean that represent if Bugfender sdk should print the logs in console (Android specific, won't have any effect on iOS) */
  printToConsole?: boolean;
  /** Register a handler for most common UI events to report them to Bugfender. Defaults to `true`. */
  logUIEvents?: boolean;
  /** Register error handler for uncaught errors that reports a crash to Bugfender. Defaults to `true`. */
  registerErrorHandler?: boolean;
}
