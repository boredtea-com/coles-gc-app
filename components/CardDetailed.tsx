import { StyleSheet, Text, View } from "react-native";


export default function CardDetailed({ name, amount, id }) {

    return (
        <View style={styles.cardPage}>
            <Text style={styles.cardName}>Card Name: {name}</Text>
            <Text style={styles.cardAmount}>Amount: {amount}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    cardPage: {
        alignContent: 'center',
        justifyContent: 'center'
    },
    cardName: {
        fontSize: 30,
        textAlign: 'center'
    },
    cardAmount: {
        fontSize: 20,
        textAlign: 'center'
    }
})