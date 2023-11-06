import React, {useState, useEffect} from 'react';
import {
  ImageBackground,
  Image,
  View,
  StyleSheet,
  Button,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MemberAPI} from '../utils/MemberAPI';

type MainTestProps = {
  navigation: StackNavigationProp<any, 'MainTest'>;
};

export default function MainTest({navigation}: MainTestProps) {
  const [IsLoggedin, setIsLoggedin] = useState(false);
  const [socket, setSocket] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleLogin = async () => {
    try {
      const {jwt} = await MemberAPI.login(email, password);
      console.log('jwt', jwt);
      console.log('이메일', email);
      console.log('셋이메일', setEmail);
      if (jwt) {
        await MemberAPI.setJwtToken(jwt);
        Alert.alert('로그인 성공', '환영합니다!');
        setIsLoggedin(true);
        navigation.navigate('MainTest');
      } else {
        throw new Error('No JWT returned');
      }
    } catch (error) {
      console.log('로그인 실패', error);
      Alert.alert('로그인 실패', '이메일 또는 비밀번호가 틀립니다.');
      setIsLoggedin(false);
    }
  };

  useEffect(() => {
    const newSocket = new WebSocket('wss://k9c203.p.ssafy.io:17777');

    newSocket.onopen = () => {
      console.log('웹소켓 연결');
      setSocket(newSocket);
    };

    newSocket.onmessage = event => {
      console.log(event.data);
      if (event.data === 'do you sent? go Phonekey') {
        navigation.navigate('Call');
        newSocket.close();
      }
    };

    newSocket.onclose = () => {
      console.log('웹소켓 연결 종료');
    };

    return () => {
      newSocket.close();
    };
  }, []);

  const handleLogout = async () => {
    try {
      Alert.alert('로그아웃 성공', '다녀오세요!');
      await MemberAPI.logout();
      navigation.navigate('MainTest');
    } catch (error) {
      Alert.alert('로그아웃 실패', '다시 시도해주세요.');
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/login_img.jpg')}
        style={styles.backgroundImage}>
        <View style={styles.contentContainer}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}></Image>
          {IsLoggedin ? (
            // 로그인 상태일 때 보이는 버튼
            <React.Fragment>
              <Text style={styles.textStyle}>
                소행성에 오신 것을 환영합니다!
              </Text>
              <Text style={styles.textStyle}>
                시뮬레이션 상황에 맞게 어플이 재구성되니
              </Text>
              <Text style={styles.textStyle}>잠시 기다려주세요.</Text>
              <Button title="로그아웃" onPress={handleLogout} />
            </React.Fragment>
          ) : (
            // 로그아웃 상태일 때 보이는 버튼
            <React.Fragment>
              <View style={styles.textinputStyle}>
                <TextInput
                  style={styles.inputText}
                  placeholder="이메일을 입력하세요."
                  value={email}
                  onChangeText={setEmail}
                />
                {emailError && <Text style={{color: 'red'}}>{emailError}</Text>}
              </View>
              <View style={styles.textinputStyle}>
                <TextInput
                  style={styles.inputText}
                  placeholder="비밀번호를 입력하세요."
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
                {passwordError && (
                  <Text style={{color: 'red'}}>{passwordError}</Text>
                )}
              </View>

              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={handleLogin}>
                <Text style={styles.buttonText}>로그인</Text>
              </TouchableOpacity>
            </React.Fragment>
          )}
        </View>
        <Button title="전화 걸기" onPress={() => navigation.navigate('Call')} />
      </ImageBackground>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  textStyle: {
    fontFamily: 'GowunDodum-Regular',
    fontSize: 20,
    color: 'white',
    marginBottom: 10,
  },
  buttonStyle: {
    backgroundColor: 'yellow',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'GowunDodum-Regular',
  },
  inputText: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    width: '80%',
    backgroundColor: 'white',
    borderColor: 'white',
    color: 'black',
    borderRadius: 10,
  },
  logo: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 20,
  },
  textinputStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
});
