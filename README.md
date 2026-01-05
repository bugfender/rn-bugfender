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

Please check the following URL for a complete API reference: https://docs.bugfender.com.

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
```

## Changelog
The changelog of the Bugfender Web SDK can be found in ReleaseNotes under the [react-native](https://bugfender.releasenotes.io/tag/react-native) tag. For all the Bugfender product changes please visit the general release notes.

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
