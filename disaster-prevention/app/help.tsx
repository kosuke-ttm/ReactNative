import { Link ,useRouter} from "expo-router";
import { View, Text ,Button} from "react-native";

export default function Home() {
    const router = useRouter();
    return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Button title="メイン画面へ戻る" onPress={() => router.push("/")} />
    <Text>Home Screen</Text>
    <Link href="/">Go to Main Screen</Link>
    </View>
    );
}
