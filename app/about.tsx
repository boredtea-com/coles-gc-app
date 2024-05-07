import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { Linking, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";


export default function About() {
    const navigation = useNavigation()
    const router = useRouter()
    const params = useLocalSearchParams()

    const { } = params

    return (
        <View style={styles.page}>
            <Text variant="bodyLarge">
                This is an open source app that gives you the ability to manage Coles gift cards. 
                This app allows you to easily check transactions and balance for cards without much interactions.
                {'\n\n'}
                This app only stores the card details locally on your device and does NOT store this information to any server. Please feel
                free to check the github code. 
                {'\n\n'}
                This app is not an official Coles app or is associated with Coles in anyway.
                {'\n\n'}
                If you have any issues or bugs please report it in github.
            </Text>
            <Button
                icon="github"
                mode="text"
                onPress={() => Linking.openURL('https://github.com/boredtea-com/coles-gc-app')}
                style={{paddingTop: 20}}
            >
                Github
            </Button>
            <View style={{flexGrow: 1}}/>

            <Text variant="bodySmall">
                {'\n\n'}
                "Card" icon by wyasa design, from thenounproject.com
            </Text>
        </View>
    )
}


const styles = StyleSheet.create({
    page: {
        flexDirection: "column",
        textAlign: "center",
        alignItems: "center",
        padding: 20,
        flex: 1
    },
    
})