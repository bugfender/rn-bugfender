# Bugfender React Native Development

## Setting up the environment

Please follow the guide located in [React Native Environment Setup](https://reactnative.dev/docs/environment-setup) "React Native CLI Quickstart" tab. The following is an overview of the needed tooling.

Basic tooling:

- NodeJS and [Yarn](https://yarnpkg.com)
- [Watchman](https://github.com/facebook/watchman)

For Android, install:

- Java Development Kit
- Android Studio with Android SDK

For iOS, install:

- XCode with Command Line Tools
- [Cocoapods](https://cocoapods.org)

**Once all the tooling is ready**:

- On the `example` folder:
  - `bundle install`: install required Ruby gems
- On the root folder:
  - `yarn`: this will install dependencies for the library & `/example`
- Add Bugfender app key in `example` project:
  - `cd example/src`
  - `cp bugfenderKey.json.example bugfenderKey.json`
  - Edit `bugfenderKey.json` & add the key

## Running the example

On a terminal window:

- `cd example`: enter the `example` folder
- `yarn start`: start React Native "server"
- Open a new terminal to run the specific example

For Android:

- Open Android Studio and run an emulator
- `cd example`: enter the `example` folder
- `yarn android`: run in Android

For iOS:

- `cd example`: enter the `example` folder
- `yarn ios`: run in iOS

For Web:

- Please use [this private project](https://bitbucket.org/bugfender/rn-bugfender-development) and execute `yarn web`

## Upgrade React Native version

Try with the official react native upgrade command:

```bash
npx react-native upgrade
```

If it does not work you can create a new updated library from scratch:

1. Using [create-react-native-library tool](https://reactnative.dev/docs/native-modules-setup)
2. Be sure to select a Native library using Java & Objective-C
3. Add the following lines to the `package.json` of the newly created library (be sure to use the latest version):

    ```json
    "dependencies": {
      "@bugfender/common": "1.0.0-alpha.5",
      "@bugfender/sdk": "^2.1.0"
    }
    ```

4. Add "dom" into the "lib" object on `tsconfig.json`:

    ```json
    "lib": [
      "esnext",
      "dom"
    ],
    ```

5. On **android/src/build.gradle** add the following to the dependencies:

    ```gradle
    implementation 'com.bugfender.sdk:android:3.+'
    ```

6. Copy `RnBugfenderModule.java` and `RnBufgenerPackage.java` to **android/src/main/java/com.bugfender.react**.
7. Add the Bugfender dependency to the podspec on the **root** folder

    ```ruby
    s.dependency 'BugfenderSDK', '~> 1.10.5'
    ```

8. Copy `RnBugefnder.h` && `RnBugefnder.mm` to **ios/**
9. Copy `App.tsx` & add `bugfenderKey.json` into **example/src/**, see `bugfenderKey.json` format below:

    ```json
    {
    "bugfenderKey": "<your Bugfdender key>"
    }
    ```

10. Run `pod install` under **example/ios/**
11. You should be ready to run the example using `yarn android` & `yarn ios`
