import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const urlPost = "https://ev2-prod-node-red-358eac71-e31.herokuapp.com/user/post";

export default function LoginScreen() {
  const [userId, setUserId] = useState('');
  const [birthday, setBirthday] = useState('');
  const router = useRouter();
  const gender = useState('other');

  const saveData = async (key: string, value: any): Promise<void> => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      console.log('データが保存されました:', jsonValue);
    } catch (e) {
      console.error('データの保存に失敗しました:', e);
    }
  };

  const handleLogin = () => {
    if (!userId.trim() || !birthday.trim()) {
      Alert.alert('エラー', 'ユーザーIDと誕生日を入力してください。');
      return;
    }

    // 誕生日の形式チェック (YYYY-MM-DD)
    const birthdayRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!birthdayRegex.test(birthday)) {
      Alert.alert('エラー', '誕生日の形式が正しくありません。YYYY-MM-DDの形式で入力してください。');
      return;
    }

    //TODO:ノードレッドにつなげる処理（ログイン）
    //nameとgenderを取ってきてメモリに格納する



    // ここにログイン処理を実装
    // 名前も追加でわかるようにする
    saveData('myKey', { userId, birthday, gender });
    // 認証が成功したら、メイン画面に遷移
    router.replace('/home');
  };

  const handleRegister = () => {
    router.replace('/register');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.messageText}>ユーザーID</Text>
      <TextInput
        style={styles.input}
        placeholder="数字"
        value={userId}
        placeholderTextColor="gray" // プレースホルダーの色
        onChangeText={setUserId}
        keyboardType="numeric"
      />
      <Text style={styles.messageText}>誕生日</Text>
      <TextInput
        style={styles.input}
        placeholder="yyyy-mm-dd"
        value={birthday}
        placeholderTextColor="gray" // プレースホルダーの色
        onChangeText={setBirthday}
      />
      <Text style={styles.messageText}> </Text>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>ログイン</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.regibutton} onPress={handleRegister}>
        <Text style={styles.buttonText}>新規登録</Text>
      </TouchableOpacity>
    </View>
  );
}

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