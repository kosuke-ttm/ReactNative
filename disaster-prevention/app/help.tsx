import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button, Text, TouchableOpacity, View, StyleSheet, Alert ,ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';
import Footer from './Footer';

const url = "https://ev2-prod-node-red-3e84e9ed-10c.herokuapp.com/post";

type LocationCoords = Location.LocationObjectCoords | null;

const App: React.FC = () => {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
  const cameraRef = useRef<CameraView>(null);
  const [location, setLocation] = useState<LocationCoords>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      console.log(location?.latitude,location?.longitude);
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
      } catch (error) {
        console.error(error);
        Alert.alert('エラー', '位置情報の取得に失敗しました。');
      }
    })();
  }, []);
  
  const savePhoto = useCallback(async (uri: string) => {
    try {
      if (mediaLibraryPermission?.granted) {
        const asset = await MediaLibrary.createAssetAsync(uri);
        await MediaLibrary.createAlbumAsync("MyApp", asset, false);
        console.log(location);

        if (!location) {
          Alert.alert('エラー', '位置情報が取得できません');
          return;
        }

        const data = {
          name: "hirabayasi",
          birthday: "2005-3-16",
          gender: ["female"],
          gps: location
        };

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
          return response.json();
        })
        .then(responseData => {
          console.log("Data sent successfully!");
          console.log("Response from Node-RED:", responseData);
        })
        .catch(error => {
          console.error(error.message);
        });
        console.log('写真を保存しました');
      } else {
        console.log('メディアライブラリの権限がありません');
      }
    } catch (error) {
      console.error('写真の保存に失敗しました:', error);
    }
  }, [mediaLibraryPermission]);

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
});

export default App;
