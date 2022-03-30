export interface ISDKCommonOptions {
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
}

export interface ISDKWebOptions {
  /** Register a handler for most common browser events to report them to Bugfender. Defaults to `true`. */
  logBrowserEvents?: boolean;
  /** App build identifier */
  build?: string;
  /** App version identifier */
  version?: string;
}

export interface ISDKNativeOptions {
  /** Logs all logs written via Logcat (Android specific, won't have any effect on iOS). Defaults to `false`. */
  enableLogcatLogging?: boolean;
}

export type ISDKOptions = ISDKCommonOptions & ISDKNativeOptions & ISDKWebOptions;

export class SDKOptionsBuilder {
  private commonOptions: ISDKCommonOptions;
  private nativeOptions?: ISDKNativeOptions;
  private webOptions?: ISDKWebOptions;

  constructor(commonOptions: ISDKCommonOptions) {
    this.commonOptions = commonOptions;
  }

  public native(nativeOptions: ISDKNativeOptions): SDKOptionsBuilder {
    this.nativeOptions = nativeOptions;
    return this;
  }

  public web(webOptions: ISDKWebOptions): SDKOptionsBuilder {
    this.webOptions = webOptions;
    return this;
  }

  public build(): ISDKOptions {
    return {
      appKey: this.commonOptions.appKey,
      apiURL: this.commonOptions.apiURL,
      baseURL: this.commonOptions.baseURL,
      overrideConsoleMethods: this.commonOptions.overrideConsoleMethods,
      printToConsole: this.commonOptions.printToConsole,
      logUIEvents: this.commonOptions.logUIEvents,
      registerErrorHandler: this.commonOptions.registerErrorHandler,
      deviceName: this.commonOptions.deviceName,
      logBrowserEvents: this.webOptions?.logBrowserEvents,
      build: this.webOptions?.build,
      version: this.webOptions?.version,
      enableLogcatLogging: this.nativeOptions?.enableLogcatLogging,
    };
  }
}
