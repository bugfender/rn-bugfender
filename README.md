# React Native plugin for Bugfender

## Getting started

The Bugfender bindings for React Native depend on the native iOS and Android Bugfender SDKs. At this moment, it is only possible to integrate Bugfender in a React Native project which includes native code. 

## Creating a RN new project compatible with Bugfender

You can create a new project using 

`$ react-native init AwesomeProject`

or if you already started your project using the tool `create-react-native-app` you will need to `eject` your project in order to add native modules. 

More info can be found in the [official docs](https://facebook.github.io/react-native/docs/getting-started.html)

Before moving to the next point, compile your project and ensure you can execute the project so we can discard future bugs from the Bugfender SDK. 

## Adding Bugfender to your project 

`$ cd path_to_your_project`

Add bugfender plugin from npm 

`$ npm install @bugfender/rn-bugfender --save`

Link the library to your project 

`$ react-native link @bugfender/rn-bugfender`

This will add the classes of the plugin to your android and iOS projects. 

### Android
You are done! 

### iOS - Cocoapods
If your iOS project contains a Podfile "react-native link" should have added a new line to it like this one: 

`pod 'RNBugfender', :path => '../node_modules/@bugfender/rn-bugfender'`

*If your project doesn't contain a Podfile but you want to start using cocoapods head to the [Cocoapods Official Docs](https://guides.cocoapods.org/using/the-podfile.html) to create a Podfile.*

**Important** 

The *podspec* of RNBugfender declares React as a dependency. If you don't override this dependency in your Podfile with your local RN path, cocoapods will download and install a new version of React Native in your iOS folder and you will end up with all the libraries duplicated.  

In a common React Native project setup you will want to override the React dependency adding this line to your Podfile: 

`pod 'React', path: '../node_modules/react-native'`

In order to avoid different errors during the linking and compiling phases we provide you with a [suggested Podfile](#suggested-podfile) at the end of this document that might avoid you some headache. 
We strongly recommend you to use it. 

Now you can go to the console and run 

`$ pod install`

When the installation has finished you should be able to run your project. 

**Remember that you should be using the Xcode workspace instead of the xcodeproj file from now on.**

If you have any problems compiling or executing, try our [Troubleshooting section](#cocoapods-troubleshooting).

### iOS - Manual

Download the latest release from [Github](https://github.com/bugfender/BugfenderSDK-iOS/releases) and copy `BugfenderSDK.framework` to `YourAwesomeProjectDirectory/ios` (same directory as AwesomeProject.xcodeproj). Then, follow the instructions to setup your project manually: 
1. Go to your **Project** > **Your Target** > **General** > **Linked Frameworks and Libraries** and drag `BugfenderSDK.framework` there (uncheck the "Copy items if needed" checkbox).
1. Make sure you have `SystemConfiguration.framework`, `Security.framework`, `MobileCoreServices.framework` and `libc++.tbd` there as well.
1. _(If using Swift)_ Import [Bugfender.swift](https://raw.githubusercontent.com/bugfender/BugfenderSDK-iOS/master/swift/Bugfender.swift) helper file to your project. Add an `import BugfenderSDK` statement at the top.

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

## Cocoapods Troubleshooting 
We did our best to create a installation process that worked for most of the users. However, the React Native configuration can be tricky sometimes.

Most of the issues are related to the high number of dependencies and the compatibility between them. As every project is different and has different needs it's difficult to provide a magic receipt that can work, however we find out that the following Podfile compiles and run correctly most of the time. You can use it as a basis to experiment and find a configuration that works for you. 

### Suggested Podfile
```
platform :ios, '9.0'

target 'SampleProject' do
  # Comment the next line if you don't want to use dynamic frameworks
  use_frameworks!

  # Pods for blufProject
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