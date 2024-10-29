import React, {useState} from "react";
import { Text, View, ScrollView, StyleSheet, Pressable, Button, TextInput} from "react-native";
import { Link ,useRouter} from "expo-router";
import Footer from './Footer';
import { Ionicons } from "@expo/vector-icons";


export default function SampleScreen() {
  const router = useRouter(); // useRouterでrouterを取得
  const [inputMsg, setInputMsg] = useState(''); // 入力値はstateで管理
  let textInput;
  return (
    <View style={styles.container}>
      <View style={styles.button}>
        <Ionicons 
          name="camera-outline" 
          size={35} 
          color="#666"
          onPress={() => alert("カメラボタンが押されました")} //あとで変える
        />
        <Button
          title="投稿"
          onPress={() => alert("投稿ボタンが押されました")} //あとでデータベースに入力文字を送信するように変える
        />
      </View>

      <TextInput
        multiline={true}
        ref={(input) => textInput = input} // 上で定義したtextInputに代入
        style={styles.inputs}
        placeholder='ここに文字を入力してください'
        value={inputMsg}
        onChangeText={(text) => {
          setInputMsg(text);
        }}
      />

      <Footer />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    padding: 0,
    flex: 1,
  },
  inputs: {
    margin: 10,
    padding: 5,
    borderWidth: 1,
    fontSize: 20,
    height: 280,
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
  },
  button: {
    margin: 0,
    padding: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

//
// export default function Index() {
//   const router = useRouter(); // useRouter フックを使用してルーターを取得
//   return (
//     <View style={styles.container}>
//       <ScrollView style={styles.scrollView}>
//         <Text>Edit app/index.tsx to edit this screen.</Text>
//         <Text>hjjdddd</Text>
//       </ScrollView>
//       <View style={styles.footer}>
//         <Pressable style={styles.button} onPress={() => {}}>
//           <Text>投稿</Text>
//         </Pressable>
//         <Pressable style={styles.button} onPress={() => router.push("/help")}>
//           <Text>救助要請</Text>
//         </Pressable>
//       </View>
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Main Screen</Text>
//       <Link href="/help">Go to Home</Link>
//       <Link href="/help">Go to Settings</Link>
//     </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   footer: {
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     bottom: 0,
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     backgroundColor: 'white',
//     padding: 10,
//     height: 85,
//     elevation: 5, // Android向けの影
//     shadowColor: '#000', // iOS向けの影
//     shadowOffset: { width: 0, height: -2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   button: {
//     padding: 10,
//     backgroundColor: '#fffafa',
//     borderRadius: 5,
//     alignItems: 'center',
//   },
// });
