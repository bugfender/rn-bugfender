package com.bugfender.react;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import android.app.Activity;
import android.app.Application;
import android.content.Intent;
import android.os.Handler;
import android.os.Looper;
import com.bugfender.sdk.Bugfender;
import com.bugfender.sdk.LogLevel;
import com.bugfender.sdk.NetworkLoggingRequestObfuscationHandler;
import com.bugfender.sdk.NetworkLoggingResponseObfuscationHandler;
import com.bugfender.sdk.NetworkRequestData;
import com.bugfender.sdk.NetworkResponseData;
import com.bugfender.sdk.ui.FeedbackActivity;
import com.bugfender.sdk.BugfenderOkHttpInterceptor;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Dynamic;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.modules.network.OkHttpClientFactory;
import com.facebook.react.modules.network.OkHttpClientProvider;

import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicReference;

import okhttp3.Interceptor;
import okhttp3.OkHttpClient;

@ReactModule(name = RnBugfenderModule.NAME)
public class RnBugfenderModule extends ReactContextBaseJavaModule implements ActivityEventListener {
  public static final String NAME = "RnBugfender";
  private static final String SDK_TYPE = "reactnative";
  private static final String OBFUSCATE_REQUEST_EVENT = "BugfenderObfuscateNetworkRequest";
  private static final String OBFUSCATE_RESPONSE_EVENT = "BugfenderObfuscateNetworkResponse";
  private static final AtomicBoolean sdkTypeSet = new AtomicBoolean(false);
  private static final AtomicBoolean okHttpInstrumented = new AtomicBoolean(false);

  private static class PendingObfuscation {
    final CountDownLatch latch = new CountDownLatch(1);
    final AtomicReference<ReadableMap> result = new AtomicReference<>();
  }

  private final ConcurrentHashMap<String, PendingObfuscation> pendingObfuscations =
    new ConcurrentHashMap<>();

  public RnBugfenderModule(ReactApplicationContext reactContext) {
    super(reactContext);
    setSdkType();
    this.getReactApplicationContext().addActivityEventListener(this);
  }

  // Required for NativeEventEmitter
  @ReactMethod
  public void addListener(String eventName) {
  }

  @ReactMethod
  public void removeListeners(Integer count) {
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


  @ReactMethod
  public void setNetworkLoggingEnabled(boolean enabled) {
    if (enabled) {
      ensureReactNativeOkHttpInstrumentation();
    }
    Bugfender.setNetworkLoggingEnabled(enabled);
  }

  @ReactMethod
  public void setNetworkLoggingCaptureBodies(boolean capture) {
    Bugfender.setNetworkLoggingCaptureBodies(capture);
  }

  @ReactMethod
  public void setNetworkLoggingCaptureErrorResponseBodies(boolean capture) {
    Bugfender.setNetworkLoggingCaptureErrorResponseBodies(capture);
  }

  @ReactMethod
  public void setNetworkLoggingURLFilter(ReadableArray allowlist, ReadableArray denylist) {
    Bugfender.setNetworkLoggingURLFilter(toStringList(allowlist), toStringList(denylist));
  }

  @ReactMethod
  public void setNetworkLoggingMaxRequestsPerMinute(Dynamic count) {
    if (count == null || count.isNull() || count.asDouble() < 0) {
      Bugfender.setNetworkLoggingMaxRequestsPerMinute(null);
    } else {
      Bugfender.setNetworkLoggingMaxRequestsPerMinute(count.asInt());
    }
  }

  @ReactMethod
  public void setNetworkLoggingRequestObfuscationHandlerEnabled(boolean enabled) {
    if (enabled) {
      Bugfender.setNetworkLoggingRequestObfuscationHandler(createRequestObfuscationHandler());
    } else {
      Bugfender.setNetworkLoggingRequestObfuscationHandler(null);
    }
  }

  @ReactMethod
  public void setNetworkLoggingResponseObfuscationHandlerEnabled(boolean enabled) {
    if (enabled) {
      Bugfender.setNetworkLoggingResponseObfuscationHandler(createResponseObfuscationHandler());
    } else {
      Bugfender.setNetworkLoggingResponseObfuscationHandler(null);
    }
  }

  @ReactMethod
  public void completeNetworkObfuscation(String requestId, ReadableMap result) {
    if (requestId == null) {
      return;
    }
    PendingObfuscation pending = pendingObfuscations.get(requestId);
    if (pending != null) {
      pending.result.set(result);
      pending.latch.countDown();
    }
  }

  private NetworkLoggingRequestObfuscationHandler createRequestObfuscationHandler() {
    return (url, headers, body) -> {
      WritableMap args = Arguments.createMap();
      args.putString("url", url != null ? url : "");
      args.putMap("headers", toWritableStringMap(headers));
      if (body != null) {
        args.putString("body", body);
      } else {
        args.putNull("body");
      }

      ReadableMap response = invokeJsObfuscation(OBFUSCATE_REQUEST_EVENT, args);
      if (response == null) {
        return new NetworkRequestData(url, headers, body);
      }

      String obfuscatedUrl = response.hasKey("url") && !response.isNull("url")
        ? response.getString("url")
        : url;
      Map<String, String> obfuscatedHeaders = headersFromReadable(
        response.hasKey("headers") ? response.getMap("headers") : null
      );
      String obfuscatedBody = null;
      if (response.hasKey("body") && !response.isNull("body")
        && response.getType("body") == ReadableType.String) {
        obfuscatedBody = response.getString("body");
      }
      return new NetworkRequestData(obfuscatedUrl, obfuscatedHeaders, obfuscatedBody);
    };
  }

  private NetworkLoggingResponseObfuscationHandler createResponseObfuscationHandler() {
    return (headers, body) -> {
      WritableMap args = Arguments.createMap();
      args.putMap("headers", toWritableStringMap(headers));
      if (body != null) {
        args.putString("body", body);
      } else {
        args.putNull("body");
      }

      ReadableMap response = invokeJsObfuscation(OBFUSCATE_RESPONSE_EVENT, args);
      if (response == null) {
        return new NetworkResponseData(headers, body);
      }

      Map<String, String> obfuscatedHeaders = headersFromReadable(
        response.hasKey("headers") ? response.getMap("headers") : null
      );
      String obfuscatedBody = null;
      if (response.hasKey("body") && !response.isNull("body")
        && response.getType("body") == ReadableType.String) {
        obfuscatedBody = response.getString("body");
      }
      return new NetworkResponseData(obfuscatedHeaders, obfuscatedBody);
    };
  }

  @Nullable
  private ReadableMap invokeJsObfuscation(String eventName, WritableMap body) {
    // Avoid deadlocking the UI thread while waiting for JS.
    if (Looper.myLooper() == Looper.getMainLooper()) {
      return null;
    }

    ReactApplicationContext context = getReactApplicationContext();
    if (context == null || !context.hasActiveReactInstance()) {
      return null;
    }

    String requestId = UUID.randomUUID().toString();
    PendingObfuscation pending = new PendingObfuscation();
    pendingObfuscations.put(requestId, pending);
    body.putString("requestId", requestId);

    new Handler(Looper.getMainLooper()).post(() -> {
      ReactApplicationContext reactContext = getReactApplicationContext();
      if (reactContext != null && reactContext.hasActiveReactInstance()) {
        reactContext
          .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
          .emit(eventName, body);
      } else {
        pending.latch.countDown();
      }
    });

    try {
      if (!pending.latch.await(3, TimeUnit.SECONDS)) {
        pendingObfuscations.remove(requestId);
        return null;
      }
    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
      pendingObfuscations.remove(requestId);
      return null;
    }

    pendingObfuscations.remove(requestId);
    return pending.result.get();
  }

  private static WritableMap toWritableStringMap(@Nullable Map<String, String> headers) {
    WritableMap map = Arguments.createMap();
    if (headers == null) {
      return map;
    }
    for (Map.Entry<String, String> entry : headers.entrySet()) {
      if (entry.getKey() != null) {
        map.putString(entry.getKey(), entry.getValue() != null ? entry.getValue() : "");
      }
    }
    return map;
  }

  private static Map<String, String> headersFromReadable(@Nullable ReadableMap map) {
    Map<String, String> result = new HashMap<>();
    if (map == null) {
      return result;
    }
    ReadableMapKeySetIterator iterator = map.keySetIterator();
    while (iterator.hasNextKey()) {
      String key = iterator.nextKey();
      if (map.isNull(key)) {
        result.put(key, "");
        continue;
      }
      switch (map.getType(key)) {
        case String:
          result.put(key, map.getString(key));
          break;
        case Number:
          result.put(key, String.valueOf(map.getDouble(key)));
          break;
        case Boolean:
          result.put(key, String.valueOf(map.getBoolean(key)));
          break;
        default:
          result.put(key, "");
          break;
      }
    }
    return result;
  }

  private static List<String> toStringList(ReadableArray array) {
    if (array == null) {
      return null;
    }
    List<String> list = new ArrayList<>(array.size());
    for (int i = 0; i < array.size(); i++) {
      if (!array.isNull(i)) {
        list.add(array.getString(i));
      }
    }
    return list;
  }

  /**
   * React Native uses OkHttp for fetch/XHR. Register Bugfender's interceptor on the
   * shared OkHttpClient so network logging and correlation headers work for JS traffic.
   */
  private void ensureReactNativeOkHttpInstrumentation() {
    if (!okHttpInstrumented.compareAndSet(false, true)) {
      return;
    }
    try {
      OkHttpClientProvider.setOkHttpClientFactory(new OkHttpClientFactory() {
        @Override
        public OkHttpClient createNewNetworkModuleClient() {
          OkHttpClient.Builder builder = OkHttpClientProvider.createClientBuilder();
          boolean alreadyPresent = false;
          for (Interceptor interceptor : builder.interceptors()) {
            if (interceptor instanceof BugfenderOkHttpInterceptor) {
              alreadyPresent = true;
              break;
            }
          }
          if (!alreadyPresent) {
            builder.addInterceptor(new BugfenderOkHttpInterceptor());
          }
          return builder.build();
        }
      });
    } catch (Throwable ignored) {
      // OkHttp / RN networking may be unavailable in some environments.
    }
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
