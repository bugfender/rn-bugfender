#!/bin/bash
set -e
set -o pipefail
set -x

VERSION=beta

rm -rf react-native-web-demo
npx create-react-app react-native-web-demo
cd react-native-web-demo

npm install react-native-web @bugfender/rn-bugfender@${VERSION} @bugfender/sdk @bugfender/common

cat > src/App.js <<EOF
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  useWindowDimensions,
} from 'react-native';

import {Bugfender, LogLevel} from '@bugfender/rn-bugfender';

// Init Bugfender with your APP key
Bugfender.init({
  appKey: '$APP_KEY',
});

Bugfender.log('This is a debug log in Bugfender from React Native Web');

export default function App() {
  const {height} = useWindowDimensions();
  const [number, setNumber] = useState(0);

  function handlePress() {
    setNumber(parseInt(Math.random() * 10000, 10) % 100);
  }

  return (
    <View style={[styles.container, {height}, StyleSheet.absoluteFill]}>
      <Text>Random number: {number}</Text>
      <View style={styles.br} />
      <Pressable
        style={({pressed}) => [
          {
            opacity: pressed ? 0.7 : 1,
          },
          styles.btn,
        ]}
        onPress={handlePress}>
        <Text style={styles.btnText}>Generate a number</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  br: {
    height: 12,
  },
  btn: {
    backgroundColor: '#222',
    padding: 10,
  },
  btnText: {
    color: '#fff',
  },
});
EOF

npm start
