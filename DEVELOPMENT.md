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

- On the root folder:
  - `npm i`: this will install dependencies for the library

## Checking React Native Version Compatibility

Before upgrading, you should check if a newer React Native version is available and whether an upgrade is needed.

### Quick Check

Run the automated version check script:

```bash
npm run check-rn-version
```

or

```bash
yarn check-rn-version
```

This script will:
- Show your current React Native version (from `devDependencies`)
- Check the latest available version on npm
- Compare versions and indicate if an upgrade is available
- Provide upgrade guidance and resources

### When to Upgrade

Consider upgrading when:
- A new major version is released (may include breaking changes)
- A new minor version includes features you need
- Security patches are released
- You encounter bugs that are fixed in newer versions
- You want to use new React Native features

**Note**: This library uses `peerDependencies` with `"react-native": "*"`, meaning it should work with any React Native version. However, you should test thoroughly after upgrading.


## SDK Version Management

The SDK version constant is shared between iOS and Android platforms to ensure consistency. The version is defined in a single source of truth.

### Updating the SDK Version

The SDK version is stored in `sdk-version.json` at the root of the project:

```json
{
  "version": 20260105
}
```

The version uses a date-based format (YYYYMMDD), for example:
- `20260105` = January 5, 2026
- `20260215` = February 15, 2026

### How It Works

1. **Single Source of Truth**: The version is defined in `sdk-version.json`
2. **Android**: The `build.gradle` file reads the JSON and creates a `BuildConfig.SDK_VERSION` field that is used in the Java code
3. **iOS**: A script (`scripts/generate-sdk-version-header.js`) generates `ios/SDKVersion.h` from the JSON file
4. **Automatic Generation**: The header file is automatically generated when you run `npm prepare` or `yarn prepare`

### Manual Generation

If you need to manually regenerate the iOS header file (for example, after editing `sdk-version.json`), run:

```bash
npm run generate-sdk-version
```

or

```bash
yarn generate-sdk-version
```

### Usage in Code

- **Android**: The version is accessed via `BuildConfig.SDK_VERSION` in `RnBugfenderModule.java`
- **iOS**: The version is accessed via the `SDK_VERSION` constant from `SDKVersion.h` in `RnBugfender.mm`

**Note**: Do not edit `ios/SDKVersion.h` manually. It is auto-generated and will be overwritten. Always update `sdk-version.json` instead.
