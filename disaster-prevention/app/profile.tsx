import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Alert, Keyboard, ActivityIndicator, Animated } from "react-native";
import Footer from './Footer';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function SampleScreen() {
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [userid, setUserid] = useState(0);
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(true);
  var displaygender = '';

  useEffect(() => {
    const fetchData = async () => {
      const savedData = await loadData('myKey');
      if (savedData) {
        setName(savedData.name || '');
        setBirthday(savedData.birthday || '');
        setGender(savedData.gender || '');
        setUserid(savedData.userId || '')
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
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>読み込み中...</Text>
      </View>
    );
  }
  if (gender==='female'){
    displaygender='女性';
  }else if (gender==='male'){
    displaygender='男性';
  }else{
    displaygender='その他';
  }

  return (
    <View style={styles.container}>

      <Text style={styles.messageText}>【氏名】</Text>
      <Text style={styles.displayText}>{name}</Text>
      <Text ></Text>

      <Text style={styles.messageText1}>【ユーザーID※必ず保管してください】</Text>
      <Text style={styles.displayText}>{userid}</Text>
      <Text ></Text>

      <Text style={styles.messageText}>【誕生日】</Text>
      <Text style={styles.displayText}>{birthday}</Text>
      <Text ></Text>

      <Text style={styles.messageText}>【性別】</Text>
      <Text style={styles.displayText}>{displaygender}</Text>
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
  messageText1: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#dc143c',
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