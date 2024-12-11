import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const urlPost = "https://ev2-prod-node-red-279dea14-133.herokuapp.com/user/login";

export default function LoginScreen() {
  const [userId, setUserId] = useState(0);
  const [birthday, setBirthday] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = async () => {
    try {
      const savedData = await AsyncStorage.getItem('myKey');
      if (savedData !== null) {
        const parsedData = JSON.parse(savedData);
        setUserId(parsedData.userId || '');
        setBirthday(parsedData.birthday || '');
      }
    } catch (e) {
      console.error('データの取得に失敗しました:', e);
    }
  };

  const saveData = async (key:any, value:any) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      console.log('データが保存されました:', jsonValue);
    } catch (e) {
      console.error('データの保存に失敗しました:', e);
    }
  };

  const handleLogin = async () => {
    if (!userId || !birthday.trim()) {
      Alert.alert('エラー', 'ユーザーIDと誕生日を入力してください。');
      return;
    }

    const birthdayRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!birthdayRegex.test(birthday)) {
      Alert.alert('エラー', '誕生日の形式が正しくありません。YYYY-MM-DDの形式で入力してください。');
      return;
    }

    try {
      const response = await fetch(urlPost, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, birthday }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send data. Status code: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('サーバーからの応答:', responseData);

      if (responseData.UserId == userId) {
        await saveData('myKey', { userId, birthday, name: responseData.UserName, gender: responseData.Gender });
        Alert.alert('ログイン成功', 'ホーム画面に移動します。');
        router.replace('/profile');
      } else {
        Alert.alert('ログイン失敗', responseData.message || 'ユーザー情報が見つかりませんでした。');
      }
    } catch (error) {
      console.error("Error during login:", error);
      Alert.alert('エラー', 'ログイン中にエラーが発生しました。');
    }
  };

  const handleRegister = () => {
    router.replace('/register');
  }
  const handleDebug = () => {
    router.replace('/home');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.messageText}>ユーザーID</Text>
      <TextInput
        style={styles.input}
        placeholder="数字"
        value={userId.toString()}
        placeholderTextColor="gray"
        onChangeText={(text) => setUserId(parseInt(text) || 0)}
        keyboardType="numeric"
      />
      <Text style={styles.messageText}>誕生日</Text>
      <TextInput
        style={styles.input}
        placeholder="yyyy-mm-dd"
        value={birthday}
        placeholderTextColor="gray"
        onChangeText={setBirthday}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>ログイン</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.regibutton} onPress={handleRegister}>
        <Text style={styles.buttonText}>新規登録</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.regibutton} onPress={handleDebug}>
        <Text style={styles.buttonText}>debug</Text>
      </TouchableOpacity>
    </View>
  );
}

// styles は変更なし

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'black'
  },
  input: {
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    color: 'white',
    marginBottom: 12,
    backgroundColor: 'black',
    paddingHorizontal: 8,
  },
  messageText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffff',
    marginBottom: 20,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    margin: 10,
    width: 340,
    alignItems: 'center',
    backgroundColor: '#008CFF', // ボタンの背景色
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  regibutton: {
    padding: 10,
    borderRadius: 5,
    width: 340,
    margin: 10,
    alignItems: 'center',
    backgroundColor: 'green', // ボタンの背景色
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: 'white', // テキストの色
    fontSize: 18,   // テキストのサイズ
    fontWeight: 'bold',
  },
});