package com.bugfender.react;

import androidx.annotation.NonNull;

import android.app.Activity;
import android.app.Application;
import android.content.Intent;
import com.bugfender.sdk.Bugfender;
import com.bugfender.sdk.LogLevel;
import com.bugfender.sdk.ui.FeedbackActivity;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

import java.net.URL;
import java.util.concurrent.atomic.AtomicBoolean;

@ReactModule(name = RnBugfenderModule.NAME)
public class RnBugfenderModule extends ReactContextBaseJavaModule implements ActivityEventListener {
  public static final String NAME = "RnBugfender";
  private static final String SDK_TYPE = "reactnative";
  private static final AtomicBoolean sdkTypeSet = new AtomicBoolean(false);

  public RnBugfenderModule(ReactApplicationContext reactContext) {
    super(reactContext);
    setSdkType();
    this.getReactApplicationContext().addActivityEventListener(this);
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  private Promise pendingPromise; // Promise that is waiting information that will be available in onActivityResult

  @ReactMethod
  public void overrideDeviceName(String deviceName) {
    Bugfender.overrideDeviceName(deviceName);
  }

  @ReactMethod
  public void init(String apiKey, boolean debug) {
    Bugfender.init(getReactApplicationContext(), apiKey, debug);
  }

  @ReactMethod
  public void setBaseUrl(String baseUrl) {
    Bugfender.setBaseUrl(baseUrl);
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
  public void setMaximumLocalStorageSize(Integer sizeInBytes) {
    Bugfender.setMaximumLocalStorageSize(sizeInBytes);
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
    Bugfender.enableUIEventLogging(getApplication());
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
  public void info(String tag, String text) {
    Bugfender.i(tag, text);
  }

  @ReactMethod
  public void trace(String tag, String text) {
    Bugfender.t(tag, text);
  }

  @ReactMethod
  public void fatal(String tag, String text) {
    Bugfender.f(tag, text);
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
  public void log(int lineNumber, String method, String file, int rawLogLevel, String tag, String message) {
    final LogLevel logLevel = parseLogLevel(rawLogLevel);
    Bugfender.log(lineNumber, method, file, logLevel, tag, message);
  }

  @ReactMethod
  public void sendIssue(String title, String text, Promise promise) {
    URL url = Bugfender.sendIssue(title, text);
    promise.resolve(url != null ? url.toString() : null);
  }

  @ReactMethod
  public void sendCrash(String title, String text, Promise promise) {
    URL url = Bugfender.sendCrash(title, text);
    promise.resolve(url != null ? url.toString() : null);
  }

  @ReactMethod
  public void sendUserFeedback(String title, String text, Promise promise) {
    URL url = Bugfender.sendUserFeedback(title, text);
    promise.resolve(url != null ? url.toString() : null);
  }

  @ReactMethod
  public void forceSendOnce() {
    Bugfender.forceSendOnce();
  }

  @ReactMethod
  public void getDeviceUrl(Promise promise) {
    URL url = Bugfender.getDeviceUrl();
    promise.resolve(url != null ? url.toString() : null);
  }

  @ReactMethod
  public void getSessionUrl(Promise promise) {
    URL url = Bugfender.getSessionUrl();
    promise.resolve(url != null ? url.toString() : null);
  }

  private static final int SHOW_USER_FEEDBACK_REQUEST_CODE = 10001;

  @ReactMethod
  public void showUserFeedback(String title, String hint, String subjectHint, String messageHint, String sendButtonText, String cancelButtonText,
                               Promise promise) {
    getCurrentActivity().startActivityForResult(
      Bugfender.getUserFeedbackActivityIntent(getApplication(), title, hint, subjectHint, messageHint, sendButtonText), SHOW_USER_FEEDBACK_REQUEST_CODE
    );
    pendingPromise = promise;
  }

  private Application getApplication() {
    return (Application) getReactApplicationContext().getApplicationContext();
  }

  private static LogLevel parseLogLevel(int loglevel) {
    switch (loglevel) {
      case 3:
        return LogLevel.Trace;
      case 4:
        return LogLevel.Info;
      case 5:
        return LogLevel.Fatal;
      case 0:
        return LogLevel.Debug;
      case 1:
        return LogLevel.Warning;
      case 2:
        return LogLevel.Error;
      default:
        return null;
    }
  }

  private static void setSdkType() {
    if (sdkTypeSet.compareAndSet(false, true)) {
      Bugfender.setSDKType(SDK_TYPE, BuildConfig.SDK_VERSION);
    }
  }

  @Override
  public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
    if (requestCode == SHOW_USER_FEEDBACK_REQUEST_CODE && pendingPromise != null) {
      if (resultCode == Activity.RESULT_OK) {
        pendingPromise.resolve(data.getStringExtra(FeedbackActivity.RESULT_FEEDBACK_URL));
      } else {
        pendingPromise.reject("0", "Feedback not sent");
      }
      pendingPromise = null;
    }
  }

  @Override
  public void onNewIntent(Intent intent) {
    // Nothing to do
  }
}
