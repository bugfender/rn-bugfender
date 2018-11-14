import {
  NativeModules,
  Platform
} from 'react-native';

var Bugfender = NativeModules.RNBugfender;

export default {
  init: (token, debug = true) => Platform.OS === 'ios' ? Bugfender.activateLogger(token) : Bugfender.init(token, debug),

  setApiUrl: apiUrl => Bugfender.setApiUrl(apiUrl),

  setForceEnabled: value => Bugfender.setForceEnabled(value),

  setMaximumLocalStorageSize: sizeInMb => Bugfender.setMaximumLocalStorageSize(sizeInMb),

  removeDeviceKey: key => Bugfender.removeDeviceKey(key),

  enableLogcatLogging: () => Bugfender.enableLogcatLogging(),

  enableCrashReporting: () => Bugfender.enableCrashReporting(),

  enableUIEventLogging: () => Bugfender.enableUIEventLogging(),

  setDeviceBoolean: (key, value) => Bugfender.setDeviceBoolean(key, value),

  setDeviceString: (key, value) => Bugfender.setDeviceString(key, value),

  setDeviceInteger: (key, value) => Bugfender.setDeviceInteger(key, value),

  setDeviceFloat: (key, value) => Bugfender.setDeviceFloat(key, value),

  d: (tag, text) => Bugfender.debug(tag, text),

  w: (tag, text) => Bugfender.warning(tag, text),

  e: (tag, text) => Bugfender.error(tag, text),

  log: (lineNumber, method, file, loglevel, tag, message) => Bugfender.log(lineNumber, method, file, loglevel, tag, message),

  sendIssue: (title, text) => Bugfender.sendIssue(title, text),

  sendUserFeedback: (title, text) => Bugfender.sendUserFeedback(title, text),

  forceSendOnce: () => Bugfender.forceSendOnce()
};
