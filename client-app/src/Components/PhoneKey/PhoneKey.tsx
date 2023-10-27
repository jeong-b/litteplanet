import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

type KeypadButtonProps = {
    number: string | number;
    onPress: (key: string | number) => void;
  };

interface PhoneKeyProps {
    onEndCall: () => void;
  }

const KeypadButton: React.FC<KeypadButtonProps> = ({ number, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={() => onPress(number)}>
      <Text style={styles.buttonText}>{number}</Text>
    </TouchableOpacity>
    
  );
};

const PhoneKey: React.FC<PhoneKeyProps> = ({ onEndCall }) => {
    const [number, setNumber] = useState<string>('');
    const [sound, setSound] = useState<Audio.Sound | null>(null);
  
    const handleKeyPress = (key: string | number) => {
      setNumber((prev) => prev + key);
    };
  
    const playSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
         require('../../../assets/music/callingmusic.mp3')
      );
      setSound(sound);
      await sound.playAsync(); 
    };
  
    const handleEndCall = async () => {
      if (sound) {
        await sound.stopAsync();
        setSound(null);
      }
      onEndCall();
    };
  
    const handleCall = () => {
      alert(number + '로 전화를 거는 중입니다...');
      playSound();
    };
  
     useEffect(() => {
      return sound
        ? () => {
            sound.unloadAsync(); 
          }
        : undefined;
    }, [sound]);
  
    return (
      <View style={styles.container}>
        <Text style={styles.numberDisplay}>{number}</Text>
        <View style={styles.keypad}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map((key) => (
            <KeypadButton key={key} number={key} onPress={handleKeyPress} />
          ))}
        </View>
        <TouchableOpacity style={styles.callButton} onPress={handleCall}>
          <MaterialIcons name="call" size={32} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.endCallButton} onPress={handleEndCall}>
          <Text style={styles.endCallText}>통화 종료</Text>
        </TouchableOpacity>
      </View>
    );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberDisplay: {
    fontSize: 32,
    marginBottom: 20,
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 240,
  },
  button: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#aaa',
  },
  buttonText: {
    fontSize: 24,
  },
  callButton: {
    marginTop: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
  endCallButton: {
    marginTop: 20,
    width: 120,
    height: 50,
    borderRadius: 10,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  endCallText: {
    color: 'white',
    fontSize: 16,
  },
});
export default PhoneKey;