import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { cards } from "../lib/db";


export default function CardItem(card: cards) {
    return (
        <Link href={{
            pathname: '/card',
            params: card
        }} asChild>
        <Pressable onLongPress={() => alert("Long pressed")}>
            <View style={styles.cardWrapper}>
                <Text style={styles.cardName}>{card.name}</Text>
                <Text style={styles.cardAmount}>${card.balance}</Text>
            </View>
        </Pressable>
        </Link>
    )
}


const styles = StyleSheet.create({
    cardWrapper: {
        flexDirection: "row",
        backgroundColor: 'rgb(217, 238, 250)',
        borderRadius: 10,
        marginVertical: 5,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 10,
        padding: 20
    },
    cardName: {
        fontSize: 25,
        fontWeight: 'bold'
    },
    cardAmount: {
        fontSize: 15,
        fontWeight: '200'
    }
})