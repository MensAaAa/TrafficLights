/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
  Text,
} from 'react-native';
import * as Watch from 'react-native-watch-connectivity';

const lights = [
  {id: 'green', isSelected: false},
  {id: 'yellow', isSelected: false},
  {id: 'red', isSelected: false},
];

const sendMessageToAppleWatch = (text) => {
  Watch.sendMessage({text}, (error) => {
    if (error) {
      console.log(error);
      Alert.alert(`the message "${error}" can't be sent`);
    }
  });
};

const App = () => {
  const [trafficLights, setTrafficLights] = useState(lights);
  const [isWatchPaired, setPairedStatus] = useState(false);

  useEffect(() => {
    Watch.subscribeToMessages((err, message, replyHandler) => {
      if (message) {
        setCurrentLight(message['message']);
        replyHandler({message: 'Response from the app'});
      }
    });
    Watch.getIsPaired((err, isPaired) => {
      if (!err) setPairedStatus(isPaired);
    });
  }, []);

  const onButtonPressed = (id) => {
    setCurrentLight(id);
    sendMessageToAppleWatch(id);
  };

  setCurrentLight = (id) => {
    const newTrafficLight = trafficLights.map((light) => {
      return {
        id: light.id,
        isSelected:
          light.id === id
            ? (light.isSelected = true)
            : (light.isSelected = false),
      };
    });

    setTrafficLights(newTrafficLight);
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text>Watch: {isWatchPaired ? 'PAIRED' : 'NOT PAIRED'}</Text>
      <View style={styles.lightsContainer}>
        {trafficLights.map((light) => (
          <TouchableOpacity
            key={light.id}
            style={{
              ...styles.button,
              backgroundColor: light.isSelected ? light.id : 'white',
            }}
            onPress={() => onButtonPressed(light.id)}
          />
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  lightsContainer: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    padding: 10,
  },
  button: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 50,
  },
});

export default App;
