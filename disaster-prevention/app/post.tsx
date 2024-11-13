import React, { useState, useEffect, useRef } from "react";
import { Text, View, StyleSheet, Button, TextInput, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from 'expo-location';
import Footer from './Footer';

type LocationCoords = Location.LocationObjectCoords | null;

export default function SampleScreen() {
  const [inputMsg, setInputMsg] = useState(''); 
  const [location, setLocation] = useState<LocationCoords>(null);
  const [loading, setLoading] = useState(true);

  const url = "https://ev2-prod-node-red-3e84e9ed-10c.herokuapp.com/post";

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('権限エラー', '位置情報へのアクセスが許可されていません。');
        setLoading(false);
        return;
      }

      let { coords } = await Location.getCurrentPositionAsync({});
      setLocation(coords);
      setLoading(false);
    })();
  }, []);

  const handlePost = () => {
    if (!location) {
      alert('エラー:位置情報が取得できません');
      return;
    }

    const data = {
      name: "hayasi",
      birthday: "2010-3-16",
      gender: ["male"],
      gps: location,
      message: inputMsg
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

    setInputMsg("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.button}>
        <Ionicons 
          name="camera-outline" 
          size={35} 
          color="#1E90FF"
          onPress={() => alert("カメラボタンが押されました")} 
        />
        <Button
          title="投稿"
          onPress={handlePost}
          disabled={loading || !location}
        />
      </View>

      <TextInput
        multiline={false}
        style={styles.inputs}
        placeholder='ここに文字を入力してください'
        value={inputMsg}
        onChangeText={setInputMsg}
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
    height: 280,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
