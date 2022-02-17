export interface ISDKOptions {
  /** The app key to log into */
  appKey: string;
  /** Base URL to Bugfender API */
  apiURL?: string;
  /** Base URL to Bugfender web dashboard */
  baseURL?: string;
  /** Override default `window.console` so it also logs to Bugfender. Defaults to `true`. */
  overrideConsoleMethods?: boolean;
  /** Print also with `window.console` when Bugfender logging methods are called. Defaults to `true`. */
  printToConsole?: boolean;
  /** Register a handler for most common UI events to report them to Bugfender. Defaults to `true`. */
  logUIEvents?: boolean;
  /** Register error handler for uncaught errors that reports a crash to Bugfender. Defaults to `true`. */
  registerErrorHandler?: boolean;
  /** Sets the name for the device. If the Device Name is not set, then the platform standard device name will be automatically sent */
  deviceName?: string;
  /** Logs all logs written via Logcat (Android specific, won't have any effect on iOS). Defaults to `false`. */
  enableLogcatLogging?: boolean;
}
