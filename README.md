# React Native plugin for Bugfender

Bugfender module for React Native and React Native for the Web. It depends on the iOS, Android and Javascript Bugfender SDKs.

This version has been tested in React Native with both the Old and New Architecture.
The New Architecture is still experimental, and therefore subject to break in new React Native versions.

## Expo compatibility

Bugfender works with Expo in the ["bare workflow"](https://docs.expo.io/introduction/managed-vs-bare/#bare-workflow). The Expo Go application (used in the managed workflow) can not run the Bugfender SDK because it contains native code.

## Adding Bugfender to your project

`$ cd path_to_your_project`

Add the bugfender plugin from npm

`$ npm install @bugfender/rn-bugfender @bugfender/sdk @bugfender/common`

After installing, close and relaunch your app with `npm run ios` or `npm run android`.

## Usage

```typescript
import { Bugfender, LogLevel } from '@bugfender/rn-bugfender';
```

Please check the following URL for a complete API reference: https://js.bugfender.com.

Note: always import @bugfender/rn-bugfender instead of @bugfender/sdk. This will enable the native features of the SDK that you wouldn't get otherwise.

### Example

```typescript
import { Bugfender, LogLevel } from '@bugfender/rn-bugfender';

// Init Bugfender with your APP key
Bugfender.init({
  appKey: '<YOUR APP KEY>',
  // apiURL: 'https://api.bugfender.com',
  // baseURL: 'https://dashboard.bugfender.com',
  // overrideConsoleMethods: true,
  // printToConsole: true,
  // logUIEvents: true,
  // registerErrorHandler: true,
  // deviceName: 'Anonymous',
  // maximumLocalStorageSize: 5 * 1024 * 1024, // Native specific
  // enableLogcatLogging: false, // Android specific
  // logBrowserEvents: true, // Web specific
  // build: '42', // Web specific
  // version: '1.0', // Web sprecific
});

// Send logs with different levels
Bugfender.log('This is a debug log in Bugfender from React Native');
Bugfender.warn('This is a warn log in Bugfender from React Native');
Bugfender.error('This is a error log in Bugfender from React Native');
Bugfender.fatal('This is a fatal log in Bugfender from React Native');
Bugfender.trace('This is a trace log in Bugfender from React Native');
Bugfender.info('This is a info log in Bugfender from React Native');

// Send low level log
Bugfender.sendLog({
  line: 1001,
  level: LogLevel.Debug,
  tag: 'tag',
  method: 'method',
  file: 'file',
  text: 'Sending low level debug log.',
});

// Send issues
Bugfender.sendIssue('Issue titile', 'This will create a new issue in Bugfender').then((url) =>
  console.log('Issue url: %s', url)
);

// Send crashes
Bugfender.sendCrash('Crash title', 'This will create a new crash in Bugfender').then((url) =>
  console.log('Crash url: %s', url)
);

// Send user feedback
Bugfender.sendUserFeedback('Feedback title', 'This will create a new feedback in Bugfender').then((url) =>
  console.log('Feedback url: %s', url)
);

// Show user feedback native screen
Bugfender.getUserFeedback({
    title: 'Feedback',
    hint: 'Please send us your feedback',
    subjectPlaceholder: 'This is the reason',
    feedbackPlaceholder: 'This is the full message',
    submitLabel: 'Send',
    closeLabel: 'Cancel',
  }
).then(response => {
  if (response.isSent) {
    console.log('RN: feedback sent with url:', response.feedbackURL);
  } else {
    console.log('RN: feedback not sent');
  }
});

// Set device values
Bugfender.setDeviceKey('device.key.string', 'fake.string.value');
Bugfender.setDeviceKey('device.key.boolean', true);
Bugfender.setDeviceKey('device.key.float', 10.1);
Bugfender.setDeviceKey('device.key.integer', 102);

// Remove device values
Bugfender.removeDeviceKey('device.key.integer');

// Get different URLs
Bugfender.getDeviceURL().then((url) => console.log('Device url: %s', url));
Bugfender.getSessionURL().then((url) => console.log('Session url: %s', url));

// Synchronizes all logs and issues with the server once
Bugfender.forceSendOnce();
```

## Changelog
The changelog of the Bugfender Web SDK can be found in ReleaseNotes under the [react-native](https://bugfender.releasenotes.io/tag/react-native) tag. For all the Bugfender product changes please visit the general release notes.

### 2.x Breaking Changes
The React Native SDK API has changed in order be unified with [Bugfender Web SDK](https://www.npmjs.com/package/@bugfender/sdk):
* The following methods have been removed and replaced with init method attributes:
  * `setApiUrl`
  * `setBaseUrl`
  * `overrideDeviceName`
  * `setMaximumLocalStorageSize`
  * `enableLogcatLogging`
  * `enableCrashReporting`
  * `enableUIEventLogging`

* The following methods have been renamed:
  * `setForceEnabled` renamed to `sendForceOnce`
  * `showUserFeedback` renamed to `sendUserFeedback`
  * `d` rename to `debug`
  * `w` renamed to `warn`
  * `e` renamed to `error`
  * `log` renamed to `sendLog`

* `setDeviceKey` method replaces `setDeviceBoolean`, `setDeviceString`, `setDeviceInteger` & `setDeviceFloat`

## Cocoapods Troubleshooting
We often get questions about CocoaPods install failing. Whilst this has nothing to do with Bugfender, you may
encounter this problem while installing the pod.

To reinstall the pods, you can do:

```sh
bundle exec pod install
```

Or, for the New Architecture:
```sh
RCT_NEW_ARCH_ENABLED=1 bundle exec pod install
```

You can find more details here: https://reactnative.dev/docs/environment-setup
