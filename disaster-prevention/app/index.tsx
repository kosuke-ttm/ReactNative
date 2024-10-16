import React, { useEffect, useState, useRef } from 'react';
import { Text, View, ScrollView, StyleSheet, Pressable ,ActivityIndicator, Alert } from "react-native";
import MapView, { Marker, Camera, Polygon } from 'react-native-maps';
import { Link ,useRouter} from "expo-router";
import * as Location from 'expo-location';
import Footer from './Footer';

// 型定義の修正
type LocationCoords = Location.LocationObjectCoords | null;

export default function Index() {
  const [location, setLocation] = useState<LocationCoords>(null); // 型定義を修正
  const [heading, setHeading] = useState<number | null>(null); // デバイスの向きを保持
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // useRouterでrouterを取得
  const mapRef = useRef<MapView>(null); // MapViewの参照

  useEffect(() => {
    (async () => {
      try{
      // 位置情報の権限をリクエスト
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('権限エラー', '位置情報へのアクセスが許可されていません。');
        return;
      }

      // 現在地を取得
      let { coords } = await Location.getCurrentPositionAsync({});
      setLocation(coords);
      setLoading(false);

      // 方位情報を取得・更新
      Location.watchHeadingAsync((headingUpdate) => {
        setHeading(headingUpdate.trueHeading); // 北を基準にした角度（0〜360度）
      });
    }catch (error) {
      console.error(error);
      Alert.alert('エラー', '位置情報の取得に失敗しました。');
    }
    })();
  }, []);

  if (loading || !location || heading === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>現在地を取得しています...</Text>
      </View>
    );
  }

    // 矢印の三角形を描くための座標を計算
    const arrowCoords = [
      {
        latitude: location.latitude + 0.0002 * Math.cos((heading - 90) * (Math.PI / 180)),
        longitude: location.longitude + 0.0002 * Math.sin((heading - 90) * (Math.PI / 180)),
      },
      {
        latitude: location.latitude + 0.0001 * Math.cos((heading + 30) * (Math.PI / 180)),
        longitude: location.longitude + 0.0001 * Math.sin((heading + 30) * (Math.PI / 180)),
      },
      {
        latitude: location.latitude + 0.0001 * Math.cos((heading - 30) * (Math.PI / 180)),
        longitude: location.longitude + 0.0001 * Math.sin((heading - 30) * (Math.PI / 180)),
      },
    ];

  useEffect(() => {
    // 位置情報と向きが更新されたらカメラを移動
    if (location && heading !== null && mapRef.current) {
      const camera: Camera = {
        center: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        pitch: 0,
        heading, // デバイスの向きに応じて回転
        altitude: 1000,
        zoom: 15,
      };
      // mapRef.current.animateCamera(camera, { duration: 1000 }); // アニメーション付きでカメラを更新
    }
  }, [location, heading]);

  if (!location) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>現在地を取得しています...</Text>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true} // 現在地のマーカーを表示
      >
        {/* ユーザーの向きを示す矢印 */}
        <Polygon
          coordinates={arrowCoords}
          fillColor="rgba(0, 150, 255, 0.6)" // 半透明の青色
          strokeColor="rgba(0, 0, 255, 0.9)"
          strokeWidth={2}
        />
      </MapView>
    <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    padding: 10,
    height: 85,
  },
  button: {
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});