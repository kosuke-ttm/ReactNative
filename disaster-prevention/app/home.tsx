import React, { useEffect, useState, useRef } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, Alert, Pressable } from 'react-native';
import MapView, { Marker, Callout, Polygon,Camera } from 'react-native-maps';
import * as Location from 'expo-location';
import Footer from './Footer';

const url = "https://ev2-prod-node-red-279dea14-133.herokuapp.com/rescue/pin";

type LocationCoords = Location.LocationObjectCoords | null;
type LocationData = {
  id: number;
  Latitude: number;
  Longitude: number;
};

export default function Home() {
  const [location, setLocation] = useState<LocationCoords>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<MapView>(null);
  // 既存の状態変数はそのままで
  const [locationData, setLocationData] = useState<LocationData[]>([]);
  const markers = [
    { id: 1, coordinate: { latitude: 35.1350, longitude: 136.9784 }, title: 'マーカー1' },
    { id: 2, coordinate: { latitude: 35.1350, longitude: 136.9788 }, title: 'マーカー2' },
    { id: 3, coordinate: { latitude: 35.1350, longitude: 136.9781 }, title: 'マーカー3' },
  ];

  useEffect(() => {
    // Node-REDからデータを取得する関数
    const fetchLocationData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setLocationData(data);
        } else if (typeof data === 'object' && data !== null) {
          // 単一のオブジェクトの場合、配列に変換
          setLocationData([data]);
        } else {
          console.error('Received data is not an array or object:', data);
          setLocationData([]);
        }
      } catch (error) {
        console.error('Failed to fetch location data:', error);
        setLocationData([]);
        // Alert.alert('エラー', 'データの取得に失敗しました。');
      }
    };
    fetchLocationData();
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
  const handleRescueComplete = (id: number) => {
    Alert.alert('救助完了', `ID ${id} の救助が完了しました。`);
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
  const BASE_OFFSET = 0.00001;

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
  // console.log(arrowCoords);

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
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            title={marker.title}
          >
            <Callout>
              <View style={styles.calloutContainer}>
                <Text>救助が必要です</Text>
                <Text>a</Text>
                <Text>b</Text>
                <Text>c</Text>
                <Text>d</Text>
                <Text>e</Text>
                <Text>f</Text>
                <Pressable 
                  style={styles.button} 
                  onPress={() => handleRescueComplete(marker.id)}
                >
                  <Text style={styles.buttonText}>救助完了</Text>
                </Pressable>
              </View>
            </Callout>
          </Marker>
          ))}
        <Polygon
          coordinates={arrowCoords}
          fillColor="rgba(0, 150, 255, 0.6)"
          strokeColor="rgba(0, 0, 255, 0.9)"
          strokeWidth={2}
        />
        {/* 取得したデータに基づいてマーカーを表示 */}
        {locationData && locationData.length > 0 && locationData.map((item) => (
  <Marker
    key={item.id}
    coordinate={{
      latitude: item.Latitude,
      longitude: item.Longitude,
    }}
    title={`ID: ${item.id}`}
  />
))}
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