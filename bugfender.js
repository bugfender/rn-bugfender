import {
  NativeModules,
  Platform
} from 'react-native';

var Bugfender = NativeModules.RNBugfender;

export default {

  /**
   * @typedef {string} LogLevel
   * @readonly
   * @enum {LogLevel}
   */
  LogLevel : {DEBUG:"Debug", WARNING:"Warning", ERROR:"Error"},

  /**
	 * Initialize the Bugfender SDK with a specific application token.
	 */
  init: (token, debug = true)  => {
    // Library initialization
    Platform.OS === 'ios' ? Bugfender.activateLogger(token) : Bugfender.init(token, debug)
  },

  /**
	 * Sets the URL of the API
   * 
	 * Usage of this function is not necessary in the general use case. Please use exclusively when
	 * directed from technical support. This method must be called before Bugfender.init().
   * @param {string} url - base URL of the Bugfender's dashboard
   */
  setApiUrl: apiUrl => Bugfender.setApiUrl(apiUrl),

  /**
	 * Synchronizes all logs and issues with the server all the time, regardless if this device is enabled or not.
	 * 
	 * Logs and issues are synchronized continuously while forceEnabled is active.
	 *
	 * @param {boolean} enabled - Whether logs and issues should be sent regardless of the Bugfender Console settings.
	 */
  setForceEnabled: value => Bugfender.setForceEnabled(value),

  /**
	 * Set the maximum size to store local log files.
	 * 
	 * By default, the limit is 5 MB.
	 *
	 * @param {number} sizeInMb Maximum size in bytes. Range accepted is from 1 byte to 50 MB. If the value provided is outside this range, it will be set to 50 MB.
	 */
  setMaximumLocalStorageSize: sizeInMb => Bugfender.setMaximumLocalStorageSize(sizeInMb),

  /**
	 * Remove a device detail.
	 *
	 * @param {string} key - key.
	 */
  removeDeviceKey: key => Bugfender.removeDeviceKey(key),

  /**
	 * Logs all logs written via Logcat.
	 */
  enableLogcatLogging: () => Bugfender.enableLogcatLogging(),

  /**
	 * Enable crash reporting tool functionality
	 */
  enableCrashReporting: () => Bugfender.enableCrashReporting(),
  
  /**
	 * Logs all actions performed and screen changes in the application, such as button touches, etc...
	 */
  enableUIEventLogging: () => Bugfender.enableUIEventLogging(),

  /**
	 * Sets a device detail with boolean type.
	 *
	 * @param {string} key - key.
	 * @param {boolean} value - A boolean value.
	 */
  setDeviceBoolean: (key, value) => Bugfender.setDeviceBoolean(key, value),

  /**
	 * Sets a device detail with string type.
	 *
	 * @param {string} key - key.
	 * @param {string} value - A string value.
	 */
  setDeviceString: (key, value) => Bugfender.setDeviceString(key, value),

  /**
	 * Sets a device detail with integer type.
	 *
	 * @param {string} key - key.
	 * @param {number} value - A integer value.
	 */
  setDeviceInteger: (key, value) => Bugfender.setDeviceInteger(key, value),

  /**
	 * Sets a device detail with double type.
	 *
	 * @param {string} key - key.
	 * @param {number} value - A double value.
	 */
  setDeviceFloat: (key, value) => Bugfender.setDeviceFloat(key, value),

  /**
	 * Default Bugfender log method.
	 *
	 * @param {string} tag - String with the tag.
	 * @param {string} message - String with the message.
	 */
  d: (tag, text) => Bugfender.debug(tag, text),

  /**
	 * Warning Bugfender log method.
	 *
	 * @param {string} tag - String with the tag.
	 * @param {string} message - String with the message.
	 */
  w: (tag, text) => Bugfender.warning(tag, text),

   /**
	 * Error Bugfender log method.
	 *
	 * @param {string} tag - String with the tag.
	 * @param {string} message - String with the message.
	 */
  e: (tag, text) => Bugfender.error(tag, text),

  /**
	 * Bugfender interface for logging, which takes a simple string as log message.
	 *
	 * @param {number} lineNumber - The line number of the log.
	 * @param {string} method - The method where the log has happened.
	 * @param {string} file - The file where the log has happened.
	 * @param {LogLevel} loglevel - Log level.
	 * @param {string} tag - Tag to be applied to the log line.
	 * @param {string} message - Message to be logged. The message will be logged verbatim, no interpretation will be performed.
	 **/
  log: (lineNumber, method, file, loglevel, tag, message) => Bugfender.log(lineNumber, method, file, loglevel, tag, message),

  /**
	 * Sends an issue
	 *
	 * @param {string} title - Short description of the issue.
	 * @param {string} text - Full details of the issue. Markdown format is accepted.
	 * @return {Promise<string>} A Promise with the URL pointing to the issue on the Bugfender dashboard or null if SDK is not initialized.
	 */
  sendIssue: (title, text) => Bugfender.sendIssue(title, text),

  /**
	 * Send a crash. Useful for controlled Exceptions
   * 
	 * @param {string} title - Title for the crash.
	 * @param {string} text - Additional info for the crash, p.e. the Stack trace. Markdown format is accepted
	 * @return A Promise with the URL pointing to the crash information on the Bugfender dashboard or null if SDK is not initialized.
	 */
  sendCrash: (title, text) => Bugfender.sendCrash(title, text),

  /**
	 * Sends user feedback
   * 
	 * @param {string} title - Title for the feedback.
	 * @param {string} message - Feedback message. Markdown format is accepted
	 * @return {Promise<string>} A Promise with the URL pointing to the feedback information on the Bugfender dashboard or null if SDK is not initialized.
	 */
  sendUserFeedback: (title, text) => Bugfender.sendUserFeedback(title, text),

  /**
	 * Synchronizes all logs and issues with the server once, regardless if this device is enabled or not.
	 * 
	 * Logs and issues are synchronized only once. After that, the logs are again sent according to the enabled flag
	 * in the Bugfender Console.
	 */
  forceSendOnce: () => Bugfender.forceSendOnce(),

  /**
	 * Get a URL pointing to the Bugfender dashboard page for the device.
	 * @return {Promise<string>} A Promise with the URL to the page if the Bugfender sdk is initialized otherwise return null.
	 */
  getDeviceUrl: () => Bugfender.getDeviceUrl(),

  /**
	 * Get a URL pointing to the Bugfender dashboard page for the device and current session.
	 * @return {Promise<string>} A Promise with the URL to the page if the Bugfender sdk is initialized otherwise return null.
	 */
  getSessionUrl: () => Bugfender.getSessionUrl()
};