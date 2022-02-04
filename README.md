# React Native plugin for Bugfender

## Getting started

The Bugfender bindings for React Native depend on the native iOS and Android Bugfender SDKs.

## Creating a RN new project compatible with Bugfender

You can create a new project using 

`$ npx react-native init AwesomeProject`

or if you already started your project using the tool `create-react-native-app` you will need to `eject` your project in order to add native modules. 

More info can be found in the [official docs](https://facebook.github.io/react-native/docs/getting-started)

Before moving to the next point **compile the project and ensure you can execute**. 
In this way, we can discard issues in the next steps. 

## Adding Bugfender to your project 

**Please note:** if you're using Expo for development, be sure to be using the ["bare workflow"](https://docs.expo.io/introduction/managed-vs-bare/#bare-workflow).

`$ cd path_to_your_project`

Add the bugfender plugin from npm 

`$ npm install @bugfender/rn-bugfender --save`

### Android
You are done!

### iOS 
You can finish the installation manually or via CocoaPods (recommended)

**CocoaPods (recommended)**

1. Ensure your iOS project contains a Podfile, otherwise you need to add it now:
```
$ cd path_to_your_project/ios
$ pod init
```
Make sure you're targeting at least iOS platform version 10 (specify `platform :ios, '10.0'`).

2. After configuring the podfile you can now go to the console and run 

`$ pod install`

When the installation has finished you should be able to run your project in iOS and Android. 

**Remember that you should be using the Xcode workspace instead of the xcodeproj file from now on.**

*At the end of this document you can find a **[recommended podfile](#recommended-podfile)**. You can use it as an example*. 

If you have any problems compiling or executing, try our [Troubleshooting section](#cocoapods-troubleshooting) at the end of this document.

**Manual installation (alternative to CocoaPods)**

Download the latest release from [Github](https://github.com/bugfender/BugfenderSDK-iOS/releases) and copy `BugfenderSDK.framework` to `YourAwesomeProjectDirectory/ios` (same directory as AwesomeProject.xcodeproj). Then, follow the instructions to setup your project manually:

* Go to your **Project** > **Your Target** > **General** > **Linked Frameworks and Libraries** and drag `BugfenderSDK.framework` there (uncheck the "Copy items if needed" checkbox).

* Make sure you have linked `SystemConfiguration.framework`, `Security.framework`, `MobileCoreServices.framework` and `libc++.tbd` as well.

## RNBugfender Usage
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

// Show user feedback native screen
Bugfender.showUserFeedback(
    'Feedback',
    'Please send us your feedback',
    'This is the reason',
    'This is the full message',
    'Send',
    'Cancel',
).then(url => {
  console.log('RN: feedback sent with url:', url);
}).catch(error => {
  console.log('RN: feedback not sent');
});

// Set values 
Bugfender.setDeviceString ("device.key.string", "fake.string.value");
Bugfender.setDeviceBoolean ("device.key.boolean", true);
Bugfender.setDeviceFloat ("device.key.float", 101);
Bugfender.setDeviceInteger ("device.key.integer", 102);
        
```

## Cocoapods Troubleshooting 
We did our best to create a installation process that worked for most of the users. However, the React Native configuration can be tricky sometimes.

Most of the issues are related to the high number of dependencies and the compatibility between them. As every project is different and has different needs it's difficult to provide a magic receipt that can work out of the box, however we find out that the following Podfile compiles and run correctly most of the time. You can use it as a basis to experiment and find a configuration that works for you. 

### Recommended Podfile
```
platform :ios, '10.0'

target 'SampleProject' do
  # Comment the next line if you don't want to use dynamic frameworks
  use_frameworks!

  # Pods for SampleProject
  pod 'AFNetworking'

  # Add new pods below this line
  pod 'RNBugfender', :path => '../node_modules/@bugfender/rn-bugfender'

  rn_path = '../node_modules/react-native'

  pod 'yoga', path: "#{rn_path}/ReactCommon/yoga"
  pod 'Folly', :podspec => '../node_modules/react-native/third-party-podspecs/Folly.podspec'
  pod 'React', path: rn_path, subspecs: [
    'Core',
    'CxxBridge',
    'DevSupport',
    'RCTActionSheet',
    'RCTAnimation',
    'RCTGeolocation',
    'RCTImage',
    'RCTLinkingIOS',
    'RCTNetwork',
    'RCTSettings',
    'RCTText',
    'RCTVibration',
    'RCTWebSocket',
  ]
  
end
```

If you are not able to get your project working you can still try to add RNBugfender with the Manual Installation or to open an issue in Github and maybe we can help you. 

Happy debugging! 
