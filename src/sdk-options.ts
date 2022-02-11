import type {ISDKOptions} from "./types/sdk-options";

export class SDKOptions {
  protected rules = {
    appKey: ['required', 'string'],
    apiURL: ['string', 'url'],
    baseURL: ['string', 'url'],
    overrideConsoleMethods: ['boolean'],
    printToConsole: ['boolean'],
    logBrowserEvents: ['boolean'],
    logUIEvents: ['boolean'],
    registerErrorHandler: ['boolean'],
    version: ['string'],
  };

  public init(options: ISDKOptions): ISDKOptions {
    // Validate user provided options
    this.validate(options);

    // Set default values if needed
    return {
      overrideConsoleMethods: true,
      printToConsole: true,
      logUIEvents: true,
      registerErrorHandler: true,
      enableLogcatLogging: false,
      ...options,
    };
  }

  protected validate(options: ISDKOptions): void {
    const urlValidator = new RegExp(/^http(s)?:\/\//i);

    Object.entries(this.rules).forEach(([key, rules]) => {
      // @ts-ignore
      const value = options[key];

      rules.forEach(rule => {
        if (rule === 'required') {
          if (typeof value === 'undefined') {
            throw new Error(`Bugfender requires '${key}' option to initialize.`)
          }
        } else if (rule === 'string') {
          if (!['string', 'undefined'].includes(typeof value)) {
            throw new Error(`'${key}' option must be a string.`);
          }
        } else if (rule === 'url') {
          if (typeof value !== 'undefined' && !urlValidator.test(value)) {
            throw new Error(`'${key}' option must be a valid URL.`);
          }
        } else if (rule === 'boolean') {
          if (!['boolean', 'undefined'].includes(typeof value)) {
            throw new Error(`'${key}' option must be a boolean.`);
          }
        }
      })
    });
  }
}
