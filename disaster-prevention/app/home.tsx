import React, { useEffect, useState, useRef } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, Alert, Pressable, Image } from 'react-native';
import MapView, { Marker, Callout, Polygon, Camera } from 'react-native-maps';
import * as Location from 'expo-location';
import Footer from './Footer';

const url = "https://ev2-prod-node-red-9497551b-cd7.herokuapp.com/rescue/pin";

type LocationCoords = Location.LocationObjectCoords | null;
type LocationData = {
  id: number;
  Latitude: number;
  Longitude: number;
};
type JsonPrimitive = string | number | boolean | null;
type JsonArray = JsonPrimitive[] | JsonObject[];
type JsonObject = { [key: string]: JsonPrimitive | JsonObject | JsonArray; };
type Json = JsonPrimitive | JsonArray | JsonObject;

export default function Home() {
  const [location, setLocation] = useState<LocationCoords>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<MapView>(null);
  const [locationData, setLocationData] = useState<LocationData[]>([]);

  var markers = [
    { id: 1, coordinate: { latitude: 35.1350, longitude: 136.9784 }, date:'2024-12-12', name:'若井',color:'yellow', message:'助けてください', time:'22:55:23', gender:'男性', uri:'http://drive.google.com/uc?export=view&id=1rYoYOPcr476Ah1XC_K-mj7as212dr9-m' },
    { id: 3, coordinate: { latitude: 35.1350, longitude: 136.9781 }, date:'2024-12-12', name:'藤澤',color:'red', message:'助けてください', time:'22:55:23', gender:'男性' , uri:'http://drive.google.com/uc?export=view&id=1NXS5yCpY320y2JR_UMGp3WBPT6A-IzCi'},
    { id: 2, coordinate: { latitude: 35.1350, longitude: 136.9788 }, date:'2024-12-12', name:'大森',color:'blue', message:'助けてください', time:'22:55:23', gender:'男性', uri:'http://drive.google.com/uc?export=view&id=1rYoYOPcr476Ah1XC_K-mj7as212dr9-m'},
    { id: 4, coordinate: { latitude: 35.134, longitude: 136.9782 }, date:'2024-12-10', name:'元貴',color:'skyblue', message:'瓦礫が多くて通れません', time:'22:55:23', gender:'女性', uri:'http://drive.google.com/uc?export=view&id=1NXS5yCpY320y2JR_UMGp3WBPT6A-IzCi' },
  ];
  // https://drive.google.com/file/d/1rYoYOPcr476Ah1XC_K-mj7as212dr9-m/view?usp=sharing

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const senddata = {pinid : 1};
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(senddata)
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        fatchData(data);
        if (Array.isArray(data)) {
          setLocationData(data);
        } else if (typeof data === 'object' && data !== null) {
          setLocationData([data]);
        } else {
          console.error('Received data is not an array or object:', data);
          setLocationData([]);
        }
      } catch (error) {
        console.error('Failed to fetch location data:', error);
        setLocationData([]);
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

  function fatchData(data: Json): void {
    if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' && data[0] !== null) {
      const firstItem = data[0];
      const date11 = 'Date' in firstItem ? firstItem['Date'] : undefined;
      if (date11 !== undefined) {
        console.log(date11);
      }
    }
  }

  const moveToCurrentLocation = () => {
    if (location && mapRef.current) {
      const camera: Camera = {
        center: { latitude: location.latitude, longitude: location.longitude },
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
      latitude: location.latitude - (BASE_WIDTH / 2) * Math.sin(heading * (Math.PI / 180)) - BASE_OFFSET * Math.cos(heading * (Math.PI / 180)),
      longitude: location.longitude + (BASE_WIDTH / 2) * Math.cos(heading * (Math.PI / 180)) - BASE_OFFSET * Math.sin(heading * (Math.PI / 180)),
    },
    {
      latitude: location.latitude - BASE_OFFSET * Math.cos(heading * (Math.PI / 180)),
      longitude: location.longitude - BASE_OFFSET * Math.sin(heading * (Math.PI / 180)),
    },
    {
      latitude: location.latitude + (BASE_WIDTH / 2) * Math.sin(heading * (Math.PI / 180)) - BASE_OFFSET * Math.cos(heading * (Math.PI / 180)),
      longitude: location.longitude - (BASE_WIDTH / 2) * Math.cos(heading * (Math.PI / 180)) - BASE_OFFSET * Math.sin(heading * (Math.PI / 180)),
    },
    {
      latitude: location.latitude + ARROW_LENGTH * Math.cos(heading * (Math.PI / 180)),
      longitude: location.longitude + ARROW_LENGTH * Math.sin(heading * (Math.PI / 180)),
    },
  ];
  const Legend = () => (
    <View style={styles.legendContainer}>
      <View style={styles.legendItem}>
        <View style={[styles.legendColor, { backgroundColor: 'blue' }]} />
        <Text style={styles.legendText}>要救助レベル1</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendColor, { backgroundColor: 'yellow' }]} />
        <Text style={styles.legendText}>要救助レベル2</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendColor, { backgroundColor: 'red' }]} />
        <Text style={styles.legendText}>要救助レベル3</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendColor, { backgroundColor: 'skyblue' }]} />
        <Text style={styles.legendText}>情報提供</Text>
      </View>
    </View>
  );
  



  return (
    <View style={styles.container}>
      {/* <Text style={styles.text}>
        緯度: {location.latitude.toFixed(6)}{' '}
        経度: {location.longitude.toFixed(6)}
      </Text> */}
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
          <Marker key={marker.id} coordinate={marker.coordinate} pinColor={marker.color} tracksViewChanges={false}>
            <Callout>
              <View style={styles.calloutContainer}>
                <Text>{marker.message}</Text>
                <Text>日付：{marker.date}</Text>
                <Text>時間：{marker.time}</Text>
                <Text>性別：{marker.gender}</Text>
                <Text>名前：{marker.name}</Text>
                <Image source={{ uri: marker.uri }} style={{ width: 100, height: 100 }} />
                <Pressable style={styles.button} onPress={() => handleRescueComplete(marker.id)}>
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
      <Legend />
      <Pressable style={styles.floatingButton} onPress={moveToCurrentLocation}>
        <Text style={styles.buttonText}>現在地</Text>
      </Pressable>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
    // ... existing styles ...
    legendContainer: {
      position: 'absolute',
      top: 10,
      left: 10,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      padding: 10,
      borderRadius: 5,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5,
    },
    legendColor: {
      width: 20,
      height: 20,
      borderRadius: 10,
      marginRight: 5,
    },
    legendText: {
      fontSize: 12,
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
    fontWeight: 'bold',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 100,
    right: 40,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#DCDCDC',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
});
