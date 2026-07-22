import type { ISDKOptions } from './types/sdk-options';
import { prepareOptions, validate, ValidationRules } from '@bugfender/common';

export class SDKOptions {
  protected rules: ValidationRules = {
    appKey: ['required', 'string'],
    apiURL: ['string', 'url'],
    baseURL: ['string', 'url'],
    overrideConsoleMethods: ['boolean'],
    printToConsole: ['boolean'],
    logBrowserEvents: ['boolean'],
    logUIEvents: ['boolean'],
    registerErrorHandler: ['boolean'],
    version: ['string'],
    networkLoggingEnabled: ['boolean'],
    networkLoggingCaptureBodies: ['boolean'],
    networkLoggingCaptureErrorResponseBodies: ['boolean'],
  };

  public init(options: ISDKOptions): ISDKOptions {
    // Prepare options
    options = prepareOptions(options);

    // Validate user provided options
    validate(options, this.rules);

    // Set default values if needed
    return {
      overrideConsoleMethods: true,
      printToConsole: true,
      logUIEvents: true,
      registerErrorHandler: true,
      enableLogcatLogging: false,
      maximumLocalStorageSize: 5 * 1024 * 1024,
      networkLoggingEnabled: false,
      networkLoggingCaptureBodies: false,
      networkLoggingCaptureErrorResponseBodies: false,
      ...options,
    };
  }
}
