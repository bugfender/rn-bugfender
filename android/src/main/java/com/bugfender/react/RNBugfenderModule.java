package com.bugfender.react;

import com.bugfender.sdk.Bugfender;
import com.bugfender.sdk.LogLevel;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class RNBugfenderModule extends ReactContextBaseJavaModule {

  public RNBugfenderModule(ReactApplicationContext rc) {
    super(rc);
  }

  @Override
  public String getName() {
    return "RNBugfender";
  }

  @ReactMethod
  public void init(String apiKey, boolean debug) {
    Bugfender.init(getReactApplicationContext(), apiKey, debug);
  }

  @ReactMethod
  public void setApiUrl(String apiUrl) {
    Bugfender.setApiUrl(apiUrl);
  }

  @ReactMethod
  public void setForceEnabled(boolean value) {
    Bugfender.setForceEnabled(value);
  }

  @ReactMethod
  public void setMaximumLocalStorageSize(Integer sizeInMB) {
    Bugfender.setMaximumLocalStorageSize(sizeInMB);
  }

  @ReactMethod
  public void removeDeviceKey(String key) {
    Bugfender.removeDeviceKey(key);
  }

  @ReactMethod
  public void enableLogcatLogging() {
    Bugfender.enableLogcatLogging();
  }

  @ReactMethod
  public void enableCrashReporting() {
    Bugfender.enableCrashReporting();
  }

  @ReactMethod
  public void enableUIEventLogging() {
    Bugfender.enableUIEventLogging(getCurrentActivity().getApplication());
  }

  @ReactMethod
  public void setDeviceBoolean(String key, boolean value) {
    Bugfender.setDeviceBoolean(key, value);
  }

  @ReactMethod
  public void setDeviceString(String key, String value) {
    Bugfender.setDeviceString(key, value);
  }

  @ReactMethod
  public void setDeviceInteger(String key, int value) {
    Bugfender.setDeviceInteger(key, value);
  }

  @ReactMethod
  public void setDeviceFloat(String key, Float value) {
    Bugfender.setDeviceFloat(key, value);
  }

  @ReactMethod
  public void debug(String tag, String text) {
    Bugfender.d(tag, text);
  }

  @ReactMethod
  public void warning(String tag, String text) {
    Bugfender.w(tag, text);
  }

  @ReactMethod
  public void error(String tag, String text) {
    Bugfender.e(tag, text);
  }

  @ReactMethod
  public void log(int lineNumber, String method, String file, String rawLogLevel, String tag, String message) {
    final LogLevel logLevel = parseLogLevel(rawLogLevel);
    Bugfender.log(lineNumber, method, file, logLevel, tag, message);
  }

  @ReactMethod
  public void sendIssue(String title, String text) {
    Bugfender.sendIssue(title, text);
  }

  @ReactMethod
  public void sendUserFeedback(String title, String text) {
    Bugfender.sendUserFeedback(title, text);
  }

  @ReactMethod
  public void forceSendOnce() {
    Bugfender.forceSendOnce();
  }

  private static LogLevel parseLogLevel(String loglevel) {
    switch (loglevel) {
      case "Debug":
        return LogLevel.Debug;
      case "Warning":
        return LogLevel.Warning;
      case "Error":
        return LogLevel.Error;
      default:
        return null;
    }
  }
}
