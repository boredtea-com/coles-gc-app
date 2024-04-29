import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";


export default function About() {
    const navigation = useNavigation()
    const router = useRouter()
    const params = useLocalSearchParams()

    const { } = params

    return (
        <View>
            <Text>About Page</Text>
        </View>
    )
}