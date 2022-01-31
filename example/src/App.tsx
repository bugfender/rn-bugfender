import * as React from 'react';

import {Button, Linking, StyleSheet, Text, View} from 'react-native';
import {Bugfender, LogLevel} from '@bugfender/rn-bugfender';

export default function App() {

  // Add a "bugfenderKey.json" containing { "bugfenderKey : "YOUR_APP_KEY" }
  // Or delete this line and hardcode your key in Bugfender.init("YOUR_APP_KEY")
  const key = require('./bugfenderKey.json').bugfenderKey;

  React.useEffect(() => {
    Bugfender.init({
      appKey: key,
      overrideConsoleMethods: true,
      printToConsole: true,
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>
        Welcome to RN Bugfender Example!
      </Text>
      <Text style={styles.instructions}>
        This application sends directly logs to the server if you push "Send Logs" button.
      </Text>
      <Text style={styles.instructions}>
        Pressing "Generate JS Crash" the application will crash due to a JavaScript error and the crash information
        will be sent to the server. This won't work on debug builds as LogBox will capture the error.
      </Text>
      <Text style={styles.instructions}>
        Pressing "Show Native User Feedback" a native screen for sending feedback will be shown.
      </Text>
      <Text style={styles.instructions}>
        Double tap R on your keyboard to reload,{'\n'}
        Shake or press menu button for dev menu
      </Text>
      <View style={styles.button}>
        <Button
          onPress={_onPressButton}
          title="Send logs"
        />
      </View>
      <View style={styles.button}>
        <Button
          onPress={_generateError}
          title="Generate JS crash"
        />
      </View>
      <View style={styles.button}>
        <Button
          onPress={_onPressShowUserFeedback}
          title="Show Native User Feedback"
        />
      </View>
      <View style={styles.button}>
        <Button
          onPress={_openDeviceURL}
          title="Open Device URL"
        />
      </View>
      <View style={styles.button}>
        <Button
          onPress={_openSessionURL}
          title="Open Session URL"
        />
      </View>
    </View>
  );

  function _generateError(): void {
    // Force crash
    const date = new Date(); //Current Date
    const hours = date.getHours(); //Current Hours
    const min = date.getMinutes(); //Current Minutes
    const sec = date.getSeconds(); //Current Seconds
    throw new Error('Force crash' + 'Time: ' + hours + ':' + min + ':' + sec);
  }

  function _onPressButton(): void {
    Bugfender.sendLog({
      level: LogLevel.Debug,
      tag: 'REACT',
      text: 'Im being called from React!',
    });

    Bugfender.log('Log without break lines in the middle of the message');
    Bugfender.log('Log with break lines \n\n in the middle of the message');

    Bugfender.warn('Warn log');
    Bugfender.error('Error log');
    Bugfender.fatal('Fatal log');
    Bugfender.trace('Trace log');
    Bugfender.info('Info log');

    console.log('Log from console');

    console.warn('Warn log from console');
    console.error('Error log from console');
    console.debug('Debug log from console');
    console.trace('Trace log from console');
    console.info('Info log from console');

    Bugfender.sendLog({
      line: 1001,
      level: LogLevel.Debug,
      tag: 'tag',
      method: 'method',
      file: 'file',
      text: 'Sending low level debug log.',
    });

    Bugfender.sendLog({
      line: 1001,
      level: LogLevel.Error,
      tag: 'tag',
      method: 'method',
      file: 'file',
      text: 'Sending low level error log.',
    });

    Bugfender.sendLog({
      line: 1001,
      level: LogLevel.Warning,
      tag: 'tag',
      method: 'method',
      file: 'file',
      text: 'Sending low level warn log.',
    });

    Bugfender.sendLog({
      line: 1001,
      level: LogLevel.Info,
      tag: 'tag',
      method: 'method',
      file: 'file',
      text: 'Sending low level info log.',
    });

    Bugfender.sendLog({
      line: 1001,
      level: LogLevel.Fatal,
      tag: 'tag',
      method: 'method',
      file: 'file',
      text: 'Sending low level log.',
    });

    Bugfender.sendLog({
      line: 1001,
      level: LogLevel.Trace,
      tag: 'tag',
      method: 'method',
      file: 'file',
      text: 'Sending low level trace log.',
    });

    Bugfender.setDeviceKey('device.key.string', 'fake.string.value');
    Bugfender.setDeviceKey('device.key.boolean', true);
    Bugfender.setDeviceKey('device.key.float', 10.1);
    Bugfender.setDeviceKey('device.key.integer', 102);

    Bugfender.sendIssue('Issue One', 'Issue Message One').then((url) =>
      console.log(url)
    );
    Bugfender.sendIssue('Issue Two', 'Issue Message Two').then((url) =>
      console.log(url)
    );
    Bugfender.sendIssue('Issue Three', 'Issue Message Three').then((url) =>
      console.log(url)
    );
    Bugfender.sendCrash('Crash title', 'Crash text').then((url) =>
      console.log(url)
    );
    Bugfender.sendUserFeedback('User feedback', 'User feedback message').then((url) =>
      console.log(url)
    );
    Bugfender.getDeviceURL().then((url) => console.log(url));
    Bugfender.getSessionURL().then((url) => console.log(url));
  }

  function _onPressShowUserFeedback(): void {
    Bugfender.getUserFeedback({
        title: 'Feedback',
        hint: 'Please send us your feedback',
        subjectPlaceholder: 'This is the reason',
        feedbackPlaceholder: 'This is the full message',
        submitLabel: 'Send',
        closeLabel: 'Cancel',
      }
    ).then(url => {
      console.log('RN: feedback sent with url:', url);
    }).catch(error => {
      console.log('RN: feedback not sent');
    });
  }

  function _openDeviceURL() {
    Bugfender.getDeviceURL().then((url) => {
      Linking.openURL(url).catch((error) =>
        console.error("Couldn't load page", error)
      );
    });
  }

  function _openSessionURL() {
    Bugfender.getSessionURL().then((url) => {
      Linking.openURL(url).catch((error) =>
        console.error("Couldn't load page", error)
      );
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  button: {
    marginBottom: 5,
  },
});
