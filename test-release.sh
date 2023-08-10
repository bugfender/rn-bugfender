#!/bin/bash
set -e
set -o pipefail
set -x

# Platforms: android / ios / web
# Architecture: old / new

VERSION=beta
PLATFORM=ios
ARCHITECTURE=new
APP_KEY="3cJCqoz5Nm3bgWwkq6tOFsMphW7NxyUZ"

PROJECT="AwesomeProject_${PLATFORM}_${ARCHITECTURE}"
rm -rf "$PROJECT" # start from scratch
npx react-native@latest init "$PROJECT"
cd "$PROJECT"
npm install @bugfender/rn-bugfender@${VERSION} @bugfender/sdk @bugfender/common

cat >> App.tsx <<EOF
import {Bugfender, LogLevel} from '@bugfender/rn-bugfender';

// Init Bugfender with your APP key
Bugfender.init({
  appKey: '$APP_KEY',
});

Bugfender.log('This is a debug log in Bugfender from React Native platform=$PLATFORM architecture=$ARCHITECTURE');
EOF

if [ "$ARCHITECTURE" == "new" ]; then
    export ORG_GRADLE_PROJECT_newArchEnabled=true
    (cd ios && bundle install && RCT_NEW_ARCH_ENABLED=1 bundle exec pod install)
fi

if [ "$PLATFORM" == "ios" ]; then
    npm run ios -- --simulator "iPhone SE (3rd generation)"
elif [ "$PLATFORM" == "android" ]; then
    # to select and launch an emulator:
    # run npm run android -- --list-devices
    npm run android
fi
