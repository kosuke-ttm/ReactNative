// 救助要請画面
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

const App: React.FC = () => {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    (async () => {
      console.log("useEffect実行");
      await requestCameraPermission();
      await requestMediaLibraryPermission();
    })();
  }, []);

  const savePhoto = useCallback(async (uri: string) => {
    try {
      if (mediaLibraryPermission?.granted) {
        const asset = await MediaLibrary.createAssetAsync(uri);
        await MediaLibrary.createAlbumAsync("MyApp", asset, false);
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
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.buttonText}>写真の撮影</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
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
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default App;


// import React, { useState, useEffect, useRef } from 'react';
// import { View, Text, StyleSheet, Button, Alert, Image } from 'react-native';
// import { CameraType } from 'expo-camera';
// import * as MediaLibrary from 'expo-media-library';
// import { Camera } from 'expo-camera';
// import { CameraCapturedPicture } from 'expo-camera';




// export default function App() {
//   const [hasCameraPermission, setHasCameraPermission] = useState(false);
//   const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(false);
//   // const [cameraRef, setCameraRef] = useState<React.RefObject<typeof Camera> | null>(null); //カメラ参照用
//   const cameraRef = useRef<Camera | null>(null);

//   const [photoUri, setPhotoUri] = useState<string | null>(null); // 撮影した写真のURI

//   useEffect(() => {
//     (async () => {
//       // カメラの権限リクエスト
//       const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
//       setHasCameraPermission(cameraStatus === 'granted');

//       // メディアライブラリの権限リクエスト
//       const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
//       setHasMediaLibraryPermission(mediaStatus === 'granted');
//     })();
//   }, []);

//   const takePicture = async () => {
//     if (cameraRef) {
//       try {
//         const photo = await cameraRef.takePictureAsync(); // 写真を撮影
//         setPhotoUri(photo.uri); // 撮影した写真のURIを保存

//         if (hasMediaLibraryPermission) {
//           const asset = await MediaLibrary.createAssetAsync(photo.uri); // メディアライブラリに保存
//           Alert.alert('保存成功', '写真が保存されました。');
//         } else {
//           Alert.alert('保存失敗', 'メディアライブラリへのアクセスが許可されていません。');
//         }
//       } catch (error) {
//         console.error(error);
//         Alert.alert('エラー', '写真の撮影または保存に失敗しました。');
//       }
//     }
//   };

//   if (!hasCameraPermission) {
//     return (
//       <View style={styles.permissionContainer}>
//         <Text>カメラへのアクセスが許可されていません。</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Camera
//         style={styles.camera}
//         type={CameraType.back}
//         ref={(ref) => setCameraRef(ref)}
//       />
//       <Button title="写真を撮影" onPress={takePicture} />
//       {photoUri && (
//         <Image source={{ uri: photoUri }} style={styles.preview} />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   camera: {
//     flex: 1,
//   },
//   permissionContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   preview: {
//     width: '100%',
//     height: 300,
//     marginTop: 10,
//   },
// });


