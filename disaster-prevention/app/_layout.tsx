import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerBackVisible: false, // 戻るボタンを非表示
          gestureEnabled: false, // スワイプジェスチャーを無効にする
          headerStyle: {
            backgroundColor: '#c0c0c0', // このスクリーン特有のヘッダー背景色
          },
        }}/>

      <Stack.Screen
        name="help"
        options={{
          headerBackVisible: false, // 戻るボタンを非表示
          gestureEnabled: false, // スワイプジェスチャーを無効にする
          headerStyle: {
            backgroundColor: '#e9967a',
          }
        }}

      />

      <Stack.Screen
        name="post"
        options={{
          headerBackVisible: false, // 戻るボタンを非表示
          gestureEnabled: false, // スワイプジェスチャーを無効にする
          headerStyle: {
            backgroundColor: '#1e90ff'
          }
        }}
      />

      <Stack.Screen
        name="home"
        options={{
          title: 'ホーム',
          headerBackVisible: false, // 戻るボタンを非表示
          gestureEnabled: false, // スワイプジェスチャーを無効にする
          headerStyle: {
            backgroundColor: '#c0c0c0', // このスクリーン特有のヘッダー背景色
          },
        }}
      />
      <Stack.Screen
        name="register"
        />

      <Stack.Screen
        name="profile"
        options={{
          headerBackVisible: false, // 戻るボタンを非表示
          gestureEnabled: false, // スワイプジェスチャーを無効にする
          headerStyle: {
            backgroundColor: '#fffaf0', // このスクリーン特有のヘッダー背景色
          }
        }}
      />
    </Stack>
  );
}

