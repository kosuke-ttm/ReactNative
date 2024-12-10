import React, { useEffect, useState, useRef } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, Alert, Pressable, Platform } from 'react-native';
import MapView, { Marker, Callout, Polygon } from 'react-native-maps';
import * as Location from 'expo-location';
import Footer from './Footer';

const url = "https://ev2-prod-node-red-9e067063-fe9.herokuapp.com/rescue/pin";

type LocationCoords = Location.LocationObjectCoords | null;
type LocationData = {
  id: number;
  Latitude: number;
  Longitude: number;
};
type EarthquakeData = {
  ID: number;
  EventID: string;
  ReportTime: string;
  ReportNum: number;
  OriginTime: string;
  HypoCenter: string;
  Latitude: number;
  Longitude: number;
  Magunitude: number;
  Depth: number;
  MaxIntensity: string;
} | null;

// マーカーのデータ
const markers = [
  { id: 1, coordinate: { latitude: 35.1350, longitude: 136.9784 }, title: 'マーカー1' },
  { id: 2, coordinate: { latitude: 35.1360, longitude: 136.9790 }, title: 'マーカー2' },
];

export default function Home() {
  const [location, setLocation] = useState<LocationCoords>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<MapView>(null);
  const [locationData, setLocationData] = useState<LocationData[]>([]);
  const [earthquakeData, setEarthquakeData] = useState<EarthquakeData>(null);

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setLocationData(Array.isArray(data) ? data : [data]);
      } catch (error) {
        console.error('Failed to fetch location data:', error);
        Alert.alert('エラー', 'データの取得に失敗しました。');
      }
    };

    fetchLocationData();

    const fetchEarthquakeData = async () => {
      try {
        const response = await fetch('http://192.168.92.72:1880/web');
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (data && data.ID) {  // IDの存在でデータの有無を確認
          setEarthquakeData(data);
        }
      } catch (error) {
        console.error('地震データの取得に失敗:', error);
      }
    };

    // 5秒ごとに地震データを取得
    const earthquakeInterval = setInterval(fetchEarthquakeData, 5000);

    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('権限エラー', '位置情報へのアクセスが許可されていません。');
          return;
        }

        let { coords } = await Location.getCurrentPositionAsync({});
        setLocation(coords);

        // ヘッディング（向き）の監視
        Location.watchHeadingAsync((headingUpdate) => {
          setHeading(headingUpdate.trueHeading);
        });
      } catch (error) {
        console.error(error);
        Alert.alert('エラー', '位置情報の取得に失敗しました。');
      } finally {
        setLoading(false);
      }
    })();
    // クリーンアップ関数を更新
    return () => {
      clearInterval(earthquakeInterval);
    };
  }, []);

  const moveToCurrentLocation = () => {
    if (location && mapRef.current) {
      mapRef.current.animateCamera({
        center: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        pitch: 0,
        heading: heading || 0,
        altitude: 1000,
        zoom: 15,
      }, { duration: 1000 });
    }
  };

  const handleRescueComplete = (id: number) => {
    Alert.alert('救助完了', `ID ${id} の救助が完了しました。`);
  };

  if (loading || !location || heading === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
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
      {earthquakeData && (
        <View style={styles.earthquakeAlert}>
          <Text style={styles.earthquakeText}>
            震源地: {earthquakeData.HypoCenter}{'\n'}
            震度: {earthquakeData.MaxIntensity}
          </Text>
        </View>
      )}
      <Text style={styles.text}>
        緯度: {location.latitude.toFixed(6)} 経度: {location.longitude.toFixed(6)}
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
        {/* マーカーを表示 */}
        {locationData.map((markers) => (
          <Marker
            key={markers.id}
            coordinate={{
              latitude: markers.Latitude,
              longitude: markers.Longitude,
            }}
            title={`ID: ${markers.id}`}
          >
            <Callout>
              <View style={styles.calloutContainer}>
                <Text>救助が必要です</Text>
                <Pressable 
                  style={styles.button} 
                  onPress={() => handleRescueComplete(markers.id)}
                >
                  <Text style={styles.buttonText}>救助完了</Text>
                </Pressable>
              </View>
            </Callout>
          </Marker>
        ))}
        
        {/* 矢印（三角形）を描画 */}
        <Polygon
          coordinates={arrowCoords}
          fillColor="rgba(255,0,0,0.5)" // 矢印の色
          strokeColor="rgba(255,0,0,1)" // 矢印の枠線色
          strokeWidth={2}
        />
        
      </MapView>

      <Pressable style={styles.floatingButton} onPress={moveToCurrentLocation}>
        <Text style={styles.buttonText}>現在地</Text>
      </Pressable>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  earthquakeAlert: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    padding: 10,
    borderRadius: 5,
    zIndex: 1000,
  },
  earthquakeText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
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
  calloutContainer: {
    width: 150,
    alignItems: 'center',
  },
  button: {
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#008CFF',
    borderRadius: 5,
   },
   buttonText: {
     fontWeight:'bold',
   },
   floatingButton:{
     position:'absolute',
     bottom :100 ,
     right :40 ,
     width :60 ,
     height :60 ,
     borderRadius :30 ,
     backgroundColor :'#DCDCDC',
     justifyContent :'center',
     alignItems :'center',
     zIndex :10 ,
     shadowColor :'#000',
     shadowOffset :{ width :0 , height :2 },
     shadowOpacity :0.8 ,
     shadowRadius :2 ,
     elevation :5 ,
   },
});