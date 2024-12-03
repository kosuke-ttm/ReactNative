import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, TextInput, Alert, Keyboard } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Footer from './Footer';
import { Picker } from '@react-native-picker/picker'; // Pickerをインポート
import * as SQLite from 'expo-sqlite';


export default function SampleScreen() {
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState(''); // 性別の状態
  const [inputMsg, setInputMsg] = useState(''); 
  const [loading, setLoading] = useState(true);

  const url = "https://ev2-prod-node-red-3e84e9ed-10c.herokuapp.com/post";

  useEffect(() => {
    (async () => {
      setLoading(false);
    })();
  }, []);
  

  const handlePost = () => {
    const data = {
      name: name,
      birthday: birthday,
      gender: gender, // 性別を追加
      message: inputMsg
    };
    // データベースを開く
    const db = SQLite.openDatabase('mydb.db');
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, age INTEGER);',
        [],
        () => console.log('テーブル作成成功'),
        (_, error) => console.log('テーブル作成失敗:', error)
      );
    });
    const getUsers = () => {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM users;',
          [],
          (_, { rows }) => console.log(JSON.stringify(rows._array)),
          (_, error) => console.log('データ取得失敗:', error)
        );
      });
    };

    
    console.log(data);

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to send data. Status code: ${response.status}`);
      }
      alert('投稿できました');
      return response.json();
    })
    .then(responseData => {
      console.log("Data sent successfully!");
      console.log("Response from Node-RED:", responseData);
    })
    .catch(error => {
      console.error(error.message);
    });

    setName("");
    setBirthday("");
    setGender(""); // 性別のリセット
    setInputMsg("");
  };
  const handleKeyPress = (e: any) => {
    // Enterキーを押した時
    if (e.nativeEvent.key === 'Enter') {
      // 改行の代わりにキーボードを閉じる
      Keyboard.dismiss();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.button}>
        <Button
          title="投稿"
          onPress={handlePost}
        />
      </View>
      
      <Text style={styles.messageText}>氏名</Text>
      <TextInput
        multiline={false}
        style={styles.inputs}
        placeholder='ここに氏名を入力してください'
        value={name}
        onChangeText={setName}
        onKeyPress={handleKeyPress} // Enterキーでキーボードを閉じる
      />
      
      <Text style={styles.messageText}>誕生日</Text>
      <TextInput
        multiline={false}
        style={styles.inputs}
        placeholder='ここに誕生日を入力してください'
        value={birthday}
        onChangeText={setBirthday}
        onSubmitEditing={() => Keyboard.dismiss()} // エンターキーでキーボードを閉じる
      />
      
      <Text style={styles.messageText}>性別</Text>
      <Picker
        selectedValue={gender}
        style={styles.picker}
        onValueChange={(itemValue) => 
          {setGender(itemValue)}} // 性別を選択
      >
        <Picker.Item label="男性" value="male" />
        <Picker.Item label="女性" value="female" />
        <Picker.Item label="その他" value="other" />
      </Picker>

      <Text style={styles.messageText}>メッセージ</Text>
      <TextInput
        multiline={false}
        style={styles.inputs}
        placeholder='メッセージを入力してください'
        value={inputMsg}
        onChangeText={setInputMsg}
        onSubmitEditing={() => Keyboard.dismiss()} // エンターキーでキーボードを閉じる
      />

      <Footer/>
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
    borderWidth: 1,
    fontSize: 20,
    color: "#333",
    
  },
  
});
