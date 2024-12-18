import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button, Text, TouchableOpacity, View, StyleSheet, Alert, Image,TextInput } from 'react-native';
import { CameraView, useCameraPermissions, Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';
import Footer from './Footer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const url = "https://ev2-prod-node-red-9497551b-cd7.herokuapp.com/rescue/help";

type LocationCoords = Location.LocationObjectCoords | null;

// const data = {
//   UserId,
//   Date,
//   Time,
//   Latitude,
//   Longitude,
//   Text,
//   Urgency
// };

const App: React.FC = () => {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
  const cameraRef = useRef<CameraView>(null);
  const [location, setLocation] = useState<LocationCoords>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');
  const [urgency, setUrgency] = useState('3');
  const router = useRouter();

  useEffect(() => {
    (async () => {
      await requestCameraPermission();
      await requestMediaLibraryPermission();

      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('権限エラー', '位置情報へのアクセスが許可されていません。');
          return;
        }

        let { coords } = await Location.getCurrentPositionAsync({});
        setLocation(coords);
        setLoading(false);

        Location.watchHeadingAsync((headingUpdate) => {
          setHeading(headingUpdate.trueHeading);
        });

        await fetchData();
      } catch (error) {
        console.error(error);
        Alert.alert('エラー', '位置情報の取得に失敗しました。');
      }
      console.log(location?.latitude, location?.longitude);
    })();
  }, []);

  const loadData = async (key: string): Promise<any> => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      console.log("asyncloadData", jsonValue);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error('データの取得に失敗しました:', e);
    }
  };

  const fetchData = async () => {
    const savedData = await loadData('myKey');
    if (savedData) {
      setUserId(savedData.userId || '');
    }
    setLoading(false);
  };

  const savePhoto = useCallback(async (uri: string) => {
    try {
      if (mediaLibraryPermission?.granted) {
        const asset = await MediaLibrary.createAssetAsync(uri);
        await MediaLibrary.createAlbumAsync("MyApp", asset, false);

        if (!location) {
          Alert.alert('エラー', '位置情報が取得できません');
          return;
        }

        const now = new Date();
        const nowdate = now.toISOString().split('T')[0];
        const nowtime = now.toTimeString().split(' ');
        const flag = 0;
        
        //TODO:写真のリンク追加
        const data = {
          userid: userId,
          date: nowdate,
          time: nowtime,
          gps: location,
          text: message,
          urgency: urgency,
          flag: flag,
        };

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        });
        console.log("noderedに送る情報",data);

        if (!response.ok) {
          throw new Error(`Failed to send data. Status code: ${response.status}`);
        }

        const responseData = await response.json();
        console.log("Data sent successfully!");
        console.log("Response from Node-RED:", responseData);
        console.log('写真を保存しました');
        router.replace('/home');

        const accessToken = "****"; // Google Drive APIのアクセストークンを設定
        const file = await fetch(uri);
        const blob = await file.blob();
  
        const formData = new FormData();
        formData.append("file", blob, "photo.jpg");
        console.log(formData);
  
        // const Googleresponse = await fetch(
        //   "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
        //   {
        //     method: "POST",
        //     headers: {
        //       Authorization: `Bearer ${accessToken}`,
        //     },
        //     body: formData,
        //   }
        // );
  
        // if (!Googleresponse.ok) {
        //   throw new Error(`アップロード失敗: ${Googleresponse.status}`);
        // }
  
        // const Googledata = await Googleresponse.json();
        // const fileLink = `https://drive.google.com/file/d/${Googledata.id}/view?usp=sharing`;
        // console.log(fileLink);
        
        // Alert.alert("アップロード成功", `リンク: ${fileLink}`);

      } else {
        console.log('メディアライブラリの権限がありません');
      }
    } catch (error) {
      console.error('写真の保存に失敗しました:', error);
      // console.error("Google Drive アップロードエラー:", error);
    }
  }, [mediaLibraryPermission, location, userId, message, urgency]);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        if (!photo) {
          console.log('写真の撮影できません');
          return;
        }
        console.log('写真を撮影しました:', photo.uri);
        await savePhoto(photo.uri);
      } catch (error) {
        console.error('写真の撮影に失敗しました:', error);
      }
    }
  };

  if (!cameraPermission || !mediaLibraryPermission) {
    return <View style={styles.container}><Text>権限を確認中...</Text></View>;
  }

  if (!cameraPermission.granted || !mediaLibraryPermission.granted) {
    return (
      <View style={styles.container}>
        <Text>カメラとメディアライブラリの使用許可が必要です</Text>
        <Button 
          onPress={() => {
            requestCameraPermission();
            requestMediaLibraryPermission();
          }} 
          title="許可を求める" 
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        multiline={false}
        style={styles.inputs}
        placeholder='どんな状況ですか？'
        value={message}
        onChangeText={setMessage}
        // onKeyPress={handleKeyPress}
      />
      {/* <Picker
      selectedValue={gender}
      style={styles.picker}
      onValueChange={(itemValue) => setGender(itemValue)}
    >
      <Picker.Item label="男性" value="male" />
      <Picker.Item label="女性" value="female" />
      <Picker.Item label="その他" value="other" />
    </Picker> */}
      <CameraView 
        style={styles.camera} 
        ref={cameraRef}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={takePicture} 
            disabled={loading || !location}
          >
            <Text style={styles.buttonText}>写真の撮影</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  button: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    bottom: 100
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  inputs: {
    margin: 10,
    padding: 5,
    borderWidth: 1,
    fontSize: 20,
    height: 28,
  },
});

export default App;