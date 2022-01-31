/* eslint-disable @typescript-eslint/no-explicit-any */
import {RnBugfender} from "./bugfender";
import {StringFormatter} from "./string-formatter";

/**
 * Overrides the `window.console` methods in order to execute the Bugfender equivalent logging
 * methods while keeping the original browser functionality.
 */
export class OverrideConsoleMethods {
  constructor(
    protected window: Window,
  ) {
  }

  public init(stringFormatter: StringFormatter): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;

    (this.window as any).console = function (console: Console) {
      return {
        ...console,
        log: function (...parameters: unknown[]) {
          console.log(...parameters);
          let message = stringFormatter.format([...parameters]);
          RnBugfender.debug('', message);
        },
        debug: function (...parameters: unknown[]) {
          console.debug(...parameters);
          let message = stringFormatter.format([...parameters]);
          RnBugfender.debug('', message);
        },
        trace: function (...parameters: unknown[]) {
          console.trace(...parameters);
          let message = stringFormatter.format([...parameters]);
          RnBugfender.trace('', message);
        },
        info: function (...parameters: unknown[]) {
          console.info(...parameters);
          let message = stringFormatter.format([...parameters]);
          RnBugfender.info('', message);
        },
        warn: function (...parameters: unknown[]) {
          console.warn(...parameters);
          let message = stringFormatter.format([...parameters]);
          RnBugfender.warning('', message);
        },
        error: function (...parameters: unknown[]) {
          console.error(...parameters);
          let message = stringFormatter.format([...parameters]);
          RnBugfender.error('', message);
        },
      };
    }((this.window as any).console);
  }
}
