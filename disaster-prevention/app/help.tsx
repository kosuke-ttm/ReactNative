// import React, { useEffect, useRef, useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
// import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
// import * as MediaLibrary from 'expo-media-library';

// const App: React.FC = () => {
//   const [cameraPermission, requestCameraPermission] = Camera.useCameraPermissions();
//   const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
//   const cameraRef = useRef<Camera>(null);

//   useEffect(() => {
//     (async () => {
//       await requestCameraPermission();
//       await requestMediaLibraryPermission();
//     })();
//   }, []);

//   const takePicture = async () => {
//     if (cameraRef.current) {
//       try {
//         const photo = await cameraRef.current.takePictureAsync();
//         console.log('写真を撮影しました:', photo.uri);
//         await savePicture(photo.uri);
//       } catch (error) {
//         console.error('写真の撮影に失敗しました:', error);
//         Alert.alert('エラー', '写真の撮影に失敗しました。');
//       }
//     }
//   };

//   const savePicture = async (uri: string) => {
//     try {
//       if (mediaLibraryPermission?.granted) {
//         const asset = await MediaLibrary.createAssetAsync(uri);
//         await MediaLibrary.createAlbumAsync("MyApp", asset, false);
//         console.log('写真を保存しました');
//         Alert.alert('成功', '写真を保存しました。');
//       } else {
//         console.log('メディアライブラリの権限がありません');
//         Alert.alert('権限エラー', 'メディアライブラリへのアクセス権限がありません。');
//       }
//     } catch (error) {
//       console.error('写真の保存に失敗しました:', error);
//       Alert.alert('エラー', '写真の保存に失敗しました。');
//     }
//   };

//   if (!cameraPermission || !mediaLibraryPermission) {
//     return <View style={styles.container}><Text>権限を確認中...</Text></View>;
//   }

//   if (!cameraPermission.granted || !mediaLibraryPermission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text>カメラとメディアライブラリの使用許可が必要です</Text>
//         <TouchableOpacity 
//           style={styles.button} 
//           onPress={() => {
//             requestCameraPermission();
//             requestMediaLibraryPermission();
//           }}
//         >
//           <Text style={styles.buttonText}>許可を求める</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <CameraView 
//         style={styles.camera} 
//         ref={cameraRef}
//       >
//         <View style={styles.buttonContainer}>
//           <TouchableOpacity 
//             style={styles.button}
//             onPress={takePicture}
//           >
//             <Text style={styles.buttonText}>写真を撮影</Text>
//           </TouchableOpacity>
//         </View>
//       </CameraView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   camera: {
//     flex: 1,
//     width: '100%',
//   },
//   buttonContainer: {
//     position: 'absolute',
//     bottom: 20,
//     alignSelf: 'center',
//   },
//   button: {
//     backgroundColor: 'blue',
//     padding: 15,
//     borderRadius: 10,
//   },
//   buttonText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: 'white',
//   },
// });

// export default App;
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