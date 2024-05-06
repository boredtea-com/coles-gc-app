import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { cardsList } from "../lib/db";
import { Checkbox, Icon } from "react-native-paper";
import { useState } from "react";


export default function CardItem({card, index, editList}:{card: cardsList, index:number, editList: boolean}) {
    let [selected, setSelected] = useState(false)

    return (
        <Link href={{
            pathname: '/card',
            params: {id: card.id, index}
        }} asChild>
        <Pressable>
            <View style={styles.cardWrapper}>
                <View style={styles.cardLeft}>
                    <Text style={[styles.cardName]}>{card.name}</Text>
                </View>
                <View style={styles.cardRight}>
                    { card.type == 'gc' && <Text style={styles.cardAmount}>${card.balance}</Text> }
                    { card.type === 'flybuys' && <Icon source={"alpha-f-circle"} size={30} color="#4287f5"/> }
                    {editList ? <Checkbox 
                        status={selected ? "checked" : "unchecked"}
                        onPress={() => setSelected(!selected)}
                    />: null}
                </View>
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
    cardLeft: {
        flexDirection: "row",
        alignItems: 'center',
    },
    cardRight: {
        flexDirection: "row",
        alignItems: 'center',
    },
    cardAmount: {
        fontSize: 15,
        fontWeight: '200'
    }
})