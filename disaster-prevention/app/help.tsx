import { Link ,useRouter} from "expo-router";
import { View, Text ,Button,StyleSheet,} from "react-native";
import MapView from 'react-native-maps';
import Footer from "./Footer";

export default function Home() {
    const router = useRouter();
    return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={styles.container}>
            <MapView style={styles.map} />
        </View>
    <Button title="メイン画面へ戻る" onPress={() => router.push("/")} />
    <Text>Home Screen</Text>
    <Link href="/">Go to Main Screen</Link>
    <Footer />
    
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
});
