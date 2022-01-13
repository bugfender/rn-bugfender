import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import { Bugfender } from '@bugfender/rn-bugfender';

export default function App() {
  const [result2, deviceUrl] = React.useState<string | undefined>();

  React.useEffect(() => {
    Bugfender.init({
      appKey: 'EjOeAkNNgeGeP5k8sgGR0ppwSYOtUKie',
    });
    Bugfender.getDeviceURL().then(deviceUrl);
  }, []);

  return (
    <View style={styles.container}>
      <Text>Result: {result2}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
