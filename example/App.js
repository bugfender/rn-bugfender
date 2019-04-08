import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';
import Bugfender from '@bugfender/rn-bugfender';

export default class AppComponent extends Component {
  constructor(props) {
    super(props);
    Bugfender.init ("YOUR_BUGFENDER_APP_KEY_HERE");
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to RN Bugfender Example!
        </Text>
        <Text style={styles.instructions}>
          This application sends directly logs to the server if you push "Send Logs" button      
        </Text>
        <Text style={styles.instructions}>
          Pressing "Generate JS Crash" the application will crash due to a JavaScript error and the crash information will be sent to the server.      
        </Text>
        <Text style={styles.instructions}>
          Double tap R on your keyboard to reload,{'\n'}
          Shake or press menu button for dev menu
        </Text>
        <View style={styles.button}>
        <Button 
            onPress={this._onPressButton}
            title="Send logs"
          />
       </View>
       <View style={styles.button}>
        <Button
            onPress={this._generateError}
            title="Generate JS crash"
          />
       </View>
      </View>
    );
  }

  _generateError = () => {
    var test;
    test.color; //This will generate a TypeError: undefined that will be sent to Bugfender
  }

  _onPressButton() {
        Bugfender.d("REACT", "Im being called from React!");

    Bugfender.d ("Bugfender", "Log without break lines in the middle of the message");
    Bugfender.d ("Bugfender", "Log with break lines \n\n in the middle of the message");
	Bugfender.d (null, "Log with tag as null");
	Bugfender.d ("Bugfender", "Normal log");
	Bugfender.d ("Bugfender", null);
	Bugfender.d (null, null);

	Bugfender.e ("Bugfender", "Log with break lines \n\n in the middle of the message");
	Bugfender.e (null, "Log with tag as null");
	Bugfender.e ("Bugfender", "Normal log");
	Bugfender.e ("Bugfender", null);
	Bugfender.e (null, null);

	Bugfender.w ("Bugfender", "Log with break lines \n\n in the middle of the message");
	Bugfender.w (null, "Log with tag as null");
	Bugfender.w ("Bugfender", "Normal log");
	Bugfender.w ("Bugfender", null);
	Bugfender.w (null, null);

	Bugfender.log (1001, "method", "file", Bugfender.LogLevel.DEBUG, "tag", "Sending low level log.");
	Bugfender.log (1001, "method", "file", Bugfender.LogLevel.ERROR, "tag", "Sending low level log.");
	Bugfender.log (1001, "method", "file", Bugfender.LogLevel.WARNING, "tag", "Sending low level log.");

	Bugfender.setDeviceString ("device.key.string", "fake.string.value");
	Bugfender.setDeviceBoolean ("device.key.boolean", true);
	Bugfender.setDeviceFloat ("device.key.float", 101);
	Bugfender.setDeviceInteger ("device.key.integer", 102);

    Bugfender.sendIssue ("Issue One", "Issue Message One").then(url =>  console.log(url));
		Bugfender.sendIssue ("Issue Two", "Issue Message Two").then(url =>  console.log(url));
    Bugfender.sendIssue ("Issue Three", "Issue Message Three").then(url =>  console.log(url));

    Bugfender.sendUserFeedback ("User feedback", "User feedback message");
    
    Bugfender.getDeviceUrl ().then(url =>  console.log(url));

    Bugfender.getSessionUrl ().then(url =>  console.log(url));

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
  }
});

AppRegistry.registerComponent('App', () => AppComponent);
