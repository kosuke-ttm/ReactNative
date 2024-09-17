import React from "react";
import { Text, View, ScrollView, StyleSheet, Button } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      
      <ScrollView style={styles.scrollView}>
        {/* スクロール可能なコンテンツをここに配置 */}
        <Text>Edit app/index.tsx to edit this screen.</Text>
        <Text>hjj</Text>
      </ScrollView>
      <View style={styles.footer}>
        <Button title="ホーム" onPress={() => {}} />
        <Button title="投稿" onPress={() => {}} />
        <Button title="設定" onPress={() => {}} />
      </View>
    </View>
  );
}

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
    elevation: 5, // Androidでの影
    shadowColor: '#000', // iOSでの影
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});
