import React from 'react';
import { Text, View, ScrollView, StyleSheet, Pressable } from "react-native";
import { Link ,useRouter} from "expo-router";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';


export function Footer() {
    const router = useRouter(); // useRouterでrouterを取得

    return (
    <View style={styles.footer}>
        {/* 投稿ボタン */}
        <Pressable style={styles.button} onPress={() => router.push("/post")}>
        <Entypo name="pencil" size={24} color="black" />
        <Text>投稿</Text>
        </Pressable>
        {/* ホームボタン */}
        <Pressable style={styles.button} onPress={() => router.push("/")}>
        <MaterialIcons name="home" size={24} color="black" />
        <Text>ホーム</Text>
        </Pressable>
        {/* 救助要請ボタン */}
        <Pressable style={styles.button} onPress={() => router.push("/help")}>
        <MaterialIcons name="emergency" size={24} color="black" />
        <Text>救助要請</Text>
        </Pressable>

        {/* プロフィールボタン */}
        <Pressable style={styles.button} onPress={() => router.push("/help")}>
        <MaterialIcons name="account-circle" size={24} color="black" />
        <Text>救助要請</Text>
        </Pressable>
    </View>
    );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
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
    elevation: 5, // Android向けの影
    shadowColor: '#ffff', // iOS向けの影
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  button: {
    padding: 10,
    backgroundColor: '#ffff',
    borderRadius: 5,
    alignItems: 'center',
  },
});

export default Footer;