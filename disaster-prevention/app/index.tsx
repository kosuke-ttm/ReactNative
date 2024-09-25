import React from "react";
import { Text, View, ScrollView, StyleSheet, Pressable } from "react-native";
import { Link ,useRouter} from "expo-router";
import Footer from './Footer';

export default function Index() {
  const router = useRouter(); // useRouterでrouterを取得

  return (
      <Footer />
      
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
