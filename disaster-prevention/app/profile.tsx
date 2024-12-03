import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, TextInput, Alert, Keyboard } from "react-native";
import { Picker } from '@react-native-picker/picker'; // Pickerをインポート
import Footer from './Footer';

export default function SampleScreen() {
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState(''); // 性別の状態
  const [loading, setLoading] = useState(true);

  const urlPost = "https://ev2-prod-node-red-3e84d49c-22c.herokuapp.com/user/post";
  const urlGet = "https://ev2-prod-node-red-3e84d49c-22c.herokuapp.com/user/get"; // データ取得用URL

  useEffect(() => {
    (async () => {
      await loadUserData(); // 初期データの読み込み
      setLoading(false);
    })();
  }, []);

  const loadUserData = async () => {
    try {
      const response = await fetch(urlGet); // awaitを追加
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const userData = await response.json(); // awaitを追加
      console.log(userData)
      setName(userData.UserName || '');
      setBirthday(userData.BirthDate || '');
      setGender(userData.Gender || '');
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('エラー', 'ユーザー情報の取得に失敗しました。');
    }
  };

  const handlePost = () => {
    const data = {
      name: name,
      birthday: birthday,
      gender: gender, // 性別を追加
    };
    
    fetch(urlPost, {
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
      
      // データ送信後に最新の情報を再取得
      loadUserData();
    })
    .catch(error => {
      console.error(error.message);
    });
  };

  const handleKeyPress = (e:any) => {
    // Enterキーを押した時
    if (e.nativeEvent.key === 'Enter') {
      // 改行の代わりにキーボードを閉じる
      Keyboard.dismiss();
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
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
        onKeyPress={handleKeyPress} // Enterキーでキーボードを閉じる
      />
      
      <Text style={styles.messageText}>誕生日</Text>
      <TextInput
        multiline={false}
        style={styles.inputs}
        placeholder='yyyy-mm-dd'
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

      <View style={styles.button}>
        <Button title="確定" onPress={handlePost} />
      </View>

      {/* {userData ? ( // userDataが存在する場合に表示
        <>
          <Text style={styles.text}>氏名: {userData.name}</Text>
          <Text style={styles.text}>誕生日: {userData.birthday}</Text>
          <Text style={styles.text}>性別: {userData.gender}</Text>
        </>
      ) : (
        <Text style={styles.text}>読み込み中...</Text> // データがまだ読み込まれていない場合
      )} */}

      

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
    
   color:"#333",
    
   },
   loadingContainer:{
       flex :1 ,
       justifyContent:'center',
       alignItems:'center',
   }
});