# React Native plugin for Bugfender

## Getting started

The Bugfender bindings for React Native depend on iOS and Android Bugfender SDKs. Therefore, at this moment it is only possible to integrate Bugfender in a React Native project which already includes native code. 

## Creating a RN new project compatible with Bugfender

You can create a new project using 

`$ react-native init AwesomeProject`

or if you already started your project using the tool `create-react-native-app` you will need to `eject` your project in order to add native modules. 

More info can be found in the [official docs](https://facebook.github.io/react-native/docs/getting-started.html)

Before moving to the next point compile your project and ensure you can execute the project as expected. In this way we can discard future bugs from the Bugfender SDK. 

## Adding Bugfender to your project 

`$ cd path_to_your_project`

Add bugfender plugin from npm 

`$ npm install @bugfender/rn-bugfender --save`

Link the library to your project 

`$ react-native link @bugfender/rn-bugfender`

This will add the classes of the plugin to your android and iOS projects. 

### Android
You are done! 

### iOS 

Download the latest release from [Github](https://github.com/bugfender/BugfenderSDK-iOS/releases) and copy `BugfenderSDK.framework` to `YourAwesomeProjectDirectory/ios` (same directory as AwesomeProject.xcodeproj). Then, follow the instructions to setup your project manually: 
1. Go to your **Project** > **Your Target** > **General** > **Linked Frameworks and Libraries** and drag `BugfenderSDK.framework` there (uncheck the "Copy items if needed" checkbox).
1. Make sure you have `SystemConfiguration.framework`, `Security.framework`, `MobileCoreServices.framework` and `libc++.tbd` there as well.
1. _(If using Swift)_ Import [Bugfender.swift](https://raw.githubusercontent.com/bugfender/BugfenderSDK-iOS/master/swift/Bugfender.swift) helper file to your project. Add an `import BugfenderSDK` statement at the top.

>__CocoaPods:__ unfortunately, RN-Bugfender is not compatible with Cocoapods at this time, the project has to be setup manually. 

## Usage
```javascript
import Bugfender from '@bugfender/rn-bugfender';

// Init Bugfender with your APP key 
Bugfender.init("your_app_key");

// Sending logs with default level 
Bugfender.d ("REACT", "This is a debug log in Bugfender from React Native");

// Sending logs with warning level 
Bugfender.w ("REACT", "This is a debug log in Bugfender from React Native");

// Sending logs with error level 
Bugfender.e ("REACT", "This is a debug log in Bugfender from React Native");

// Low level logs 
Bugfender.log (1001, "method", "file", "Debug", "tag", "Sending low level log.");
Bugfender.log (1001, "method", "file", "Error", "tag", "Sending low level log.");
Bugfender.log (1001, "method", "file", "Warning", "tag", "Sending low level log.");
        
// Creating issues 
Bugfender.sendIssue ("New issue", "This will create a new issue in Bugfender");

// Send user feedback 
Bugfender.sendUserFeedback ("New feedback", "This will create a new feedback in Bugfender");

// Set values 
Bugfender.setDeviceString ("device.key.string", "fake.string.value");
Bugfender.setDeviceBoolean ("device.key.boolean", true);
Bugfender.setDeviceFloat ("device.key.float", 101);
Bugfender.setDeviceInteger ("device.key.integer", 102);
        
```
