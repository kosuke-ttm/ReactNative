import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, TextInput, Alert, Keyboard, ActivityIndicator, Animated } from "react-native";
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const urlPost = "https://ev2-prod-node-red-279dea14-133.herokuapp.com/user/register";


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
  const [userid] = useState(Date.now()); // ユニークなuseridとして現在のタイムスタンプを使用
  const [gender, setGender] = useState('other');
  const [loading, setLoading] = useState(true);
  const [alertVisible, setAlertVisible] = useState(false);
  const router = useRouter();
  const [alertMessage, setAlertMessage] = useState('');

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
    if (!name || !birthday || !gender) {
      Alert.alert('エラー', 'すべてのフィールドを入力してください。');
      return;
    }

    const dataToSend = { userid, name, birthday, gender };
    console.log("サーバーに送る情報：", dataToSend);
    showCustomAlert('確定中...');
  
    try {
      const response = await fetch(urlPost, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to send data. Status code: ${response.status}`);
      }
  
      const responseData = await response.json();
      console.log(responseData);
      Alert.alert('確定しました');
      //TODO:ここでサーバーから取ってきたjsonデータからuseridを取ってきて変数useridに格納する処理を書く
      await saveData('myKey', { userid, name, birthday, gender });
      router.replace('/home');
    } catch (error) {
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
      <Text style={styles.messageText}>氏名</Text>
      <TextInput
        multiline={false}
        style={styles.inputs}
        placeholder='ここに氏名を入力してください'
        value={name}
        onChangeText={setName}
        onKeyPress={handleKeyPress}
      />
      
      <Text style={styles.messageText}>誕生日</Text>
      <TextInput
        multiline={false}
        style={styles.inputs}
        placeholder='yyyy-mm-dd'
        value={birthday}
        onChangeText={setBirthday}
        onSubmitEditing={() => Keyboard.dismiss()}
      />
      
      <Text style={styles.messageText}>性別</Text>
      <Picker
        selectedValue={gender}
        style={styles.picker}
        onValueChange={(itemValue) => setGender(itemValue)}
      >
        <Picker.Item label="男性" value="male" />
        <Picker.Item label="女性" value="female" />
        <Picker.Item label="その他" value="other" />
      </Picker>

      <View style={styles.button}>
        <Button title="確定" onPress={handlePost} />
      </View>

      <CustomAlert message={alertMessage} visible={alertVisible} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    padding: 0,
    flex: 1,
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
    color:"black",
   },
   loadingContainer:{
       flex :1 ,
       justifyContent:'center',
       alignItems:'center',
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
   alertText:{
     fontSize :16 ,
   }
});