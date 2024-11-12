import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerBackVisible: false, // 戻るボタンを非表示
          gestureEnabled: false // スワイプジェスチャーを無効にする
        }}/>

      <Stack.Screen
        name="help"
        options={{
          headerBackVisible: false, // 戻るボタンを非表示
          gestureEnabled: false // スワイプジェスチャーを無効にする
        }}
      />

      <Stack.Screen
        name="post"
        options={{
          headerBackVisible: false, // 戻るボタンを非表示
          gestureEnabled: false // スワイプジェスチャーを無効にする
        }}
      />

      <Stack.Screen
        name="profile"
        options={{
          headerBackVisible: false, // 戻るボタンを非表示
          gestureEnabled: false // スワイプジェスチャーを無効にする
        }}
      />
    </Stack>
  );
}

