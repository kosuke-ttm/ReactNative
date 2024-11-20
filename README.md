cd disaster-prevention
npx expo start

```bash
nvm use 20
```

参考：https://docs.expo.dev/develop/tools/


# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.



## 画面遷移するためにインストール(for screen transition)
```bash
npx expo install expo-router  
```

## 地図を表示させるため
```bash
npx expo install react-native-maps
```

## アイコンをつけるため
```bash
npm install --save react-native-vector-icons 
```

## 自分の現在地を取得するため
```bash
npx expo install expo-location react-native-maps
```

## カメラ機能を入れるため
```bash
npx expo install expo-camera
```

## 写真を端末上に保存するため
```bash
npx expo install expo-camera expo-media-library
```

##　選択肢を作るため
```bash
npm install @react-native-picker/picker @react-native-community/datetimepicker
```

npm install expo@52

npm warn をなくならない

### SDK51から52にアップグレードしてしまったことでビルドエラーになったから下を実行
npm install -g expo-cli@latest
npm update
expo-cli upgrade
npm i
npm run prebuild
npx expo install --fix