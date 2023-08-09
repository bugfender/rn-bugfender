import type {TurboModule} from 'react-native/Libraries/TurboModule/RCTExport';
import {TurboModuleRegistry} from 'react-native';
import type {Float,Int32} from 'react-native/Libraries/Types/CodegenTypes';

export interface Spec extends TurboModule {
  activateLogger(key: string): void;
  setApiUrl(apiUrl: string): void;
  setBaseUrl(baseUrl: string): void;
  setForceEnabled(enabled: boolean): void;
  overrideDeviceName(deviceName: string): void;
  setMaximumLocalStorageSize(size: number): void;
  getDeviceUrl(): Promise<string>;
  getSessionUrl(): Promise<string>;
  removeDeviceKey(key: string): void;
  enableLogcatLogging(): void;
  enableCrashReporting(): void;
  enableUIEventLogging(): void;
  setDeviceBoolean(deviceKey: string, boolValue: boolean): void;
  setDeviceString(deviceKey: string, stringValue: string): void;
  setDeviceInteger(deviceKey: string, intValue: Int32): void;
  setDeviceFloat(deviceKey: string, floatValue: Float): void;
  info(tag: string, text: string): void;
  trace(tag: string, text: string): void;
  fatal(tag: string, text: string): void;
  debug(tag: string, text: string): void;
  warning(tag: string, text: string): void;
  error(tag: string, text: string): void;
  log(lineNumber: Int32, method: string, file: string, logLevel: Int32, tag: string, message: string): void;
  sendIssue(tag: string, text: string): Promise<string>;
  sendCrash(tag: string, text: string): Promise<string>;
  forceSendOnce(): void;
  sendUserFeedback(title: string, text: string): Promise<string>;
  showUserFeedback(title: string, text: string): Promise<string>;
}

export default TurboModuleRegistry.get<Spec>(
  'RnBugfender',
) as Spec | null;
