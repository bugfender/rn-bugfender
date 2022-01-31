import {NativeModules, Platform} from 'react-native';
import type {ISDKOptions} from './types/sdk-options';
import type {UserFeedbackOptions, UserFeedbackResult} from './user-feedback';
import {DefaultUserFeedbackOptions} from './user-feedback';
import type {DeviceKeyValue} from './types/device';
import type {ILogEntry} from './types/log';
import {StringFormatter} from './string-formatter';
import {LogLevel} from "./types/log";
import {OverrideConsoleMethods} from "./override-console-methods";
import {PrintToConsole} from "./print-to-console";

const LINKING_ERROR =
  `The package '@bugfender/rn-bugfender' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ios: "- You have run 'pod install'\n", default: ''}) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const RnBugfender = NativeModules.RnBugfender
  ? NativeModules.RnBugfender
  : new Proxy(
    {},
    {
      get() {
        throw new Error(LINKING_ERROR);
      },
    }
  );

class BugfenderClass {
  stringFormatter = new StringFormatter();
  overrideConsoleMethods = new OverrideConsoleMethods(window);
  printToConsole = new PrintToConsole(global.console);

  public init(options: ISDKOptions) {

    // Library initialization
    Platform.OS === 'ios'
      ? RnBugfender.activateLogger(options.appKey)
      : RnBugfender.init(options.appKey, false);

    if (typeof options.apiURL !== 'undefined') {
      RnBugfender.setApiUrl(options.apiURL);
    }

    if (typeof options.baseURL !== 'undefined') {
      RnBugfender.setBaseUrl(options.baseURL);
    }

    if (options.enableLogcatLogging) {
      RnBugfender.enableLogcatLogging();
    }

    if (options.logUIEvents) {
      RnBugfender.enableUIEventLogging();
    }

    if (options.registerErrorHandler) {
      RnBugfender.enableCrashReporting();
    }

    if (options.overrideConsoleMethods) {
      this.overrideConsoleMethods.init(this.stringFormatter, this.printToConsole);
    }

    this.printToConsole.init(options.printToConsole ?? false);
  }

  /**
   * @returns Bugfender dashboard URL for the device
   */
  public getDeviceURL(): Promise<string> {
    return RnBugfender.getDeviceUrl();
  }

  /**
   * @returns Bugfender dashboard URL for the current session
   */
  public getSessionURL(): Promise<string> {
    return RnBugfender.getSessionUrl();
  }

  /**
   * Show a modal which asks for feedback. Once the user closes the modal or sends the feedback
   * the returned promise resolves with the result.
   *
   * ```typescript
   * Bugfender.getUserFeedback().then((result) => {
   *     if (result.isSent) {
   *         // User sent the feedback
   *         // `result.feedbackURL` contains the Bugfender feedback URL
   *     } else {
   *         // User closed the modal without sending the feedback
   *     }
   * });
   * ```
   *
   * @param options Options object to configure modal strings
   * @returns Promise which resolves once the user closes the modal or sends the feedback
   */
  public async getUserFeedback(
    options?: UserFeedbackOptions
  ): Promise<UserFeedbackResult> {
    return new Promise<UserFeedbackResult>(function (resolve, reject) {
      let defaultOptions = new DefaultUserFeedbackOptions();
      if (typeof options === 'undefined') {
        options = defaultOptions;
      }
      return RnBugfender.showUserFeedback(
        options.title ?? defaultOptions.title,
        options.hint ?? defaultOptions.hint,
        options.subjectPlaceholder ?? defaultOptions.subjectPlaceholder,
        options.feedbackPlaceholder ?? defaultOptions.feedbackPlaceholder,
        options.submitLabel ?? defaultOptions.submitLabel,
        options.closeLabel ?? defaultOptions.closeLabel
      ).then(
        (value: string) => {
          resolve({
            isSent: true,
            feedbackURL: value,
          });
        },
        (reason: any) => {
          resolve({
            isSent: false,
          });
        }
      );
    });
  }

  /**
   * @param obj A JavaScript value to output
   * @param objs List of optional JavaScript values to output
   */
  public log(obj: unknown, ...objs: unknown[]): void;
  /**
   * String message with optional substitutions. This mimicks que the `window.console` template messages. [Learn more in MDN](https://developer.mozilla.org/en-US/docs/Web/API/console#Using_string_substitutions).
   *
   * @param msg Message with optional `%` placeholders
   * @param subst Optional substitutions list
   */
  public log(msg: string, ...subst: unknown[]): void;
  public log(...parameters: unknown[]): void {
    this.printToConsole.log(...parameters);

    let message = this.stringFormatter.format([...parameters]);
    RnBugfender.debug('', message);
  }

  /**
   * @param obj A JavaScript value to output
   * @param objs List of optional JavaScript values to output
   */
  public warn(obj: unknown, ...objs: unknown[]): void;
  /**
   * String message with optional substitutions. This mimicks que the `window.console` template messages. [Learn more in MDN](https://developer.mozilla.org/en-US/docs/Web/API/console#Using_string_substitutions).
   *
   * @param msg Message with optional `%` placeholders
   * @param subst Optional substitutions list
   */
  public warn(msg: string, ...subst: unknown[]): void;
  public warn(...parameters: unknown[]): void {
    this.printToConsole.warn(...parameters);

    let message = this.stringFormatter.format([...parameters]);
    RnBugfender.warning('', message);
  }

  /**
   * @param obj A JavaScript value to output
   * @param objs List of optional JavaScript values to output
   */
  public error(obj: unknown, ...objs: unknown[]): void;
  /**
   * String message with optional substitutions. This mimicks que the `window.console` template messages. [Learn more in MDN](https://developer.mozilla.org/en-US/docs/Web/API/console#Using_string_substitutions).
   *
   * @param msg Message with optional `%` placeholders
   * @param subst Optional substitutions list
   */
  public error(msg: string, ...subst: unknown[]): void;
  public error(...parameters: unknown[]): void {
    this.printToConsole.error(...parameters);

    let message = this.stringFormatter.format([...parameters]);
    RnBugfender.error('', message);
  }

  /**
   * @param obj A JavaScript value to output
   * @param objs List of optional JavaScript values to output
   */
  public trace(obj: unknown, ...objs: unknown[]): void;
  /**
   * String message with optional substitutions. This mimicks que the `window.console` template messages. [Learn more in MDN](https://developer.mozilla.org/en-US/docs/Web/API/console#Using_string_substitutions).
   *
   * @param msg Message with optional `%` placeholders
   * @param subst Optional substitutions list
   */
  public trace(msg: string, ...subst: unknown[]): void;
  public trace(...parameters: unknown[]): void {
    this.printToConsole.trace(...parameters);

    let message = this.stringFormatter.format([...parameters]);
    RnBugfender.trace('', message);
  }

  /**
   * @param obj A JavaScript value to output
   * @param objs List of optional JavaScript values to output
   */
  public info(obj: unknown, ...objs: unknown[]): void;
  /**
   * String message with optional substitutions. This mimicks que the `window.console` template messages. [Learn more in MDN](https://developer.mozilla.org/en-US/docs/Web/API/console#Using_string_substitutions).
   *
   * @param msg Message with optional `%` placeholders
   * @param subst Optional substitutions list
   */
  public info(msg: string, ...subst: unknown[]): void;
  public info(...parameters: unknown[]): void {
    this.printToConsole.info(...parameters);

    let message = this.stringFormatter.format([...parameters]);
    RnBugfender.info('', message);
  }

  /**
   * @param obj A JavaScript value to output
   * @param objs List of optional JavaScript values to output
   */
  public fatal(obj: unknown, ...objs: unknown[]): void;
  /**
   * String message with optional substitutions. This mimicks que the `window.console` template messages. [Learn more in MDN](https://developer.mozilla.org/en-US/docs/Web/API/console#Using_string_substitutions).
   *
   * @param msg Message with optional `%` placeholders
   * @param subst Optional substitutions list
   */
  public fatal(msg: string, ...subst: unknown[]): void;
  public fatal(...parameters: unknown[]): void {
    this.printToConsole.error(...parameters);

    let message = this.stringFormatter.format([...parameters]);
    RnBugfender.fatal('', message);
  }

  /**
   * Remove a device associated key-value pair. [Learn more](https://bugfender.com/blog/associated-device-information/).
   *
   * @param key Key identifier
   */
  public removeDeviceKey(key: string): void {
    RnBugfender.removeDeviceKey(key);
    this.printToConsole.info(`Device key "${key}" removed`);
  }

  /**
   * Use this method if you need more control over the data sent while logging. See `ILogEntry` interface reference to see all the accepted properties.
   *
   * @param log Log object that complies with `ILogEntry` interface.
   */
  public sendLog(log: ILogEntry): void {
    this.printToConsole.printLog(log);

    RnBugfender.log(
      log.line ?? 0,
      log.method ?? '',
      log.file ?? '',
      log.level ?? LogLevel.Debug,
      log.tag ?? '',
      log.text ?? ''
    );
  }

  /**
   * Send an issue.
   *
   * @param title - Title
   * @param text - Text content
   * @returns Bugfender dashboard URL for the issue.
   */
  public sendIssue(title: string, text: string): Promise<string> {
    this.printToConsole.warn(`Issue: ${title}.\n${text}`);
    return RnBugfender.sendIssue(title, text);
  }

  /**
   * Send a crash report.
   *
   * @param title - Title
   * @param text - Text content
   * @returns Bugfender dashboard URL for the crash.
   */
  public sendCrash(title: string, text: string): Promise<string> {
    this.printToConsole.error(`Crash: ${title}.\n${text}`);
    return RnBugfender.sendCrash(title, text);
  }

  /**
   * Send an user feedback.
   *
   * @param title - Title/Subject
   * @param text - Feedback text
   * @returns Bugfender dashboard URL for the feedback.
   */
  public sendUserFeedback(title: string, text: string): Promise<string> {
    this.printToConsole.info(`User Feedback: ${title}.\n${text}`);
    return RnBugfender.sendUserFeedback(title, text);
  }

  /**
   * Set a device associated key-value pair. [Learn more](https://bugfender.com/blog/associated-device-information/).
   *
   * @param key Key identifier.
   * @param value Value.
   */
  public setDeviceKey(key: string, value: DeviceKeyValue): void {
    this.printToConsole.info(`Device key "${key}" set to "${value}"`);

    if (typeof value === 'boolean') {
      RnBugfender.setDeviceBoolean(key, value);
    } else if (typeof value === 'string') {
      RnBugfender.setDeviceString(key, value);
    } else {
      // typeof value === 'number'
      if (Number.isInteger(value)) {
        RnBugfender.setDeviceInteger(key, value);
      } else {
        RnBugfender.setDeviceFloat(key, value);
      }
    }
  }

  /**
   * Synchronizes all logs and issues with the server once, regardless if this device is enabled or not.
   *
   * Logs and issues are synchronized only once. After that, the logs are again sent according to the enabled flag
   * in the Bugfender Console.
   */
  public forceSendOnce(): void {
    RnBugfender.forceSendOnce();
  }
}

export {
  BugfenderClass, RnBugfender
}
