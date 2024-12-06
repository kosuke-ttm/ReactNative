import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Alert, Keyboard, ActivityIndicator, Animated } from "react-native";
import Footer from './Footer';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface CustomAlertProps {
  message: string;
  visible: boolean;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ message, visible }) => {
  const opacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, 2000);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.alertContainer, { opacity }]}>
      <Text style={styles.alertText}>{message}</Text>
    </Animated.View>
  );
};

export default function SampleScreen() {
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [id] = useState(0);
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(true);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  
  const urlPost = "https://ev2-prod-node-red-11839213-b3c.herokuapp.com/user/post";

  useEffect(() => {
    const fetchData = async () => {
      const savedData = await loadData('myKey');
      if (savedData) {
        setName(savedData.name || '');
        setBirthday(savedData.birthday || '');
        setGender(savedData.gender || '');
      }
      setLoading(false);
    };
    
    fetchData();
  }, []);

  const loadData = async (key: string): Promise<any> => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      console.log("asyncloadData",jsonValue);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error('データの取得に失敗しました:', e);
    }
  };

  const saveData = async (key: string, value: any): Promise<void> => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      console.log('データが保存されました:', jsonValue);
    } catch (e) {
      console.error('データの保存に失敗しました:', e);
    }
  };

  const showCustomAlert = (message:string) => {
    setAlertMessage(message);
    setAlertVisible(true);
    setTimeout(() => setAlertVisible(false), 2300);
  };

  const handlePost = async () => {
    const dataToSend = { id, name, birthday, gender };
    showCustomAlert('確定中...');
  
    try {
      const response = await fetch(urlPost, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });
  
      // レスポンスのステータスチェック
      if (!response.ok) {
        throw new Error(`Failed to send data. Status code: ${response.status}`);
      }
  
      // レスポンスの内容を取得
      const responseData = await response.json();
      
      // レスポンスデータをUIに表示
      Alert.alert('確定しました', `サーバーからのレスポンス:\n${JSON.stringify(responseData, null, 2)}`);
      console.log("Response from Node-RED:", responseData);
  
      // データを保存
      await saveData('myKey', { id, name, birthday, gender });
    } catch (error) {
      // 型ガードでエラーメッセージを取得
    if (error instanceof Error) {
      console.error("Error during fetch:", error.message);
      Alert.alert('エラー', error.message);
    } else {
      console.error("Unexpected error:", error);
      Alert.alert('エラー', '予期しないエラーが発生しました。');
    }
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.nativeEvent.key === 'Enter') {
      Keyboard.dismiss();
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>読み込み中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <Text style={styles.messageText}>【氏名】</Text>
      <Text style={styles.displayText}>{name}</Text>
      <Text ></Text>

      <Text style={styles.messageText}>【誕生日】</Text>
      <Text style={styles.displayText}>{birthday}</Text>
      <Text ></Text>

      <Text style={styles.messageText}>【性別】</Text>
      <Text style={styles.displayText}>{gender}</Text>

      <CustomAlert message={alertMessage} visible={alertVisible} />
      <Footer/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    padding: 0,
    flex: 1,
    backgroundColor: '#fffaf0'
    
  },
  displayText:{
    fontSize: 24,
    color: 'black'
  },
  inputs: {
    margin: 10,
    padding: 5,
    borderWidth: 1,
    fontSize: 20,
    height: 28,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  messageText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  picker: {
    margin: 10,
    padding: 5,
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -100 }, { translateY: -25 }],
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
    elevation: 5,
  },
  alertText: {
    fontSize: 16,
  },
});