import React, { useEffect, useState, useRef } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, Alert, Pressable } from 'react-native';
import MapView, { Polygon, Camera } from 'react-native-maps';
import * as Location from 'expo-location';
import Footer from './Footer';
import axios from 'axios';

type LocationCoords = Location.LocationObjectCoords | null;

export default function Index() {
  const [location, setLocation] = useState<LocationCoords>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    (async () => {
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

  const moveToCurrentLocation = () => {
    if (location && mapRef.current) {
      const camera: Camera = {
        center: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        pitch: 0,
        heading: heading || 0,
        altitude: 1000,
        zoom: 15,
      };
      mapRef.current.animateCamera(camera, { duration: 1000 });
    }
  };

  if (loading || !location || heading === null) {
    return (
      <View style={styles.loadingContainer}>

        <Text>現在地を取得しています...</Text>
      </View>
    );
  }

  const ARROW_LENGTH = 0.0003;
  const BASE_WIDTH = 0.00015;
  const BASE_OFFSET = 0.0001;

  const arrowCoords = [
    {
      latitude: location.latitude + ARROW_LENGTH * Math.cos(heading * (Math.PI / 180)),
      longitude: location.longitude + ARROW_LENGTH * Math.sin(heading * (Math.PI / 180)),
    },
    {
      latitude: location.latitude - (BASE_WIDTH / 2) * Math.sin(heading * (Math.PI / 180)) -
                BASE_OFFSET * Math.cos(heading * (Math.PI / 180)),
      longitude: location.longitude + (BASE_WIDTH / 2) * Math.cos(heading * (Math.PI / 180)) -
                 BASE_OFFSET * Math.sin(heading * (Math.PI / 180)),
    },
    {
      latitude: location.latitude - BASE_OFFSET * Math.cos(heading * (Math.PI / 180)),
      longitude: location.longitude - BASE_OFFSET * Math.sin(heading * (Math.PI / 180)),
    },
    {
      latitude: location.latitude + (BASE_WIDTH / 2) * Math.sin(heading * (Math.PI / 180)) -
                BASE_OFFSET * Math.cos(heading * (Math.PI / 180)),
      longitude: location.longitude - (BASE_WIDTH / 2) * Math.cos(heading * (Math.PI / 180)) -
                 BASE_OFFSET * Math.sin(heading * (Math.PI / 180)),
    },
    {
      latitude: location.latitude + ARROW_LENGTH * Math.cos(heading * (Math.PI / 180)),
      longitude: location.longitude + ARROW_LENGTH * Math.sin(heading * (Math.PI / 180)),
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        緯度: {location.latitude.toFixed(6)}{' '}
        経度: {location.longitude.toFixed(6)}
      </Text>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
      >
        <Polygon
          coordinates={arrowCoords}
          fillColor="rgba(0, 150, 255, 0.6)"
          strokeColor="rgba(0, 0, 255, 0.9)"
          strokeWidth={2}
        />
      </MapView>

      {/* 右下の丸いボタン */}
      <Pressable style={styles.floatingButton} onPress={moveToCurrentLocation}>
        <Text style={styles.buttonText}>現在地</Text>
      </Pressable>

      <Footer />
      
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    color: 'black',
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
  floatingButton: {
    position: 'absolute',
    bottom: 100,
    right: 40,
    width: 60,
    height: 60,
    borderRadius: 30, // 丸い形にする
    backgroundColor: '#DCDCDC',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10, // 他の要素より手前に表示
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5, // Android用の影
  },
  buttonText: {
    fontSize: 25,
    color: '#000',
  },
});
