import Barcode from "@components/Barcode";
import Divider from "@components/Divider";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, Image, Pressable, StyleSheet, Text, View } from "react-native";
import * as Brightness from 'expo-brightness';
import { cards, cardsList, deleteCard, getCard } from "../../lib/db";
import { useCardCollectionStore, useCardStore } from "../../store/card";

export default function Page() {
    const navigation = useNavigation()
    const router = useRouter()
    const params: Partial<cardsList & {index: number}> = useLocalSearchParams()
    const { name, balance, id, number, index } = params

    const deleteCardState = useCardCollectionStore((state) => state.deleteCard)
    const card = useCardStore((state) => state.card)

    const setCard = useCardStore((state) => state.setCard)

    useEffect(() => {
        getCard(id, setCard)
    }, [])

    const [revealPin, setRevealPin] = useState(false)

    return (
        <Pressable style={{flex: 1}} onPress={(e) => setRevealPin(!revealPin)}>
            <View style={styles.cardPage}>
                <Barcode barcode={number} scale={2} height={15}/>
                <Divider dividerStyle={{marginBottom: 10}}/>
                <Text style={styles.cardHeader}>PIN</Text>
                <Text style={[styles.cardPin, {paddingBottom: 10}]}>{!revealPin ? '****' : card?.pin}</Text>
                <Text style={styles.cardHeader}>Description</Text>
                <Text style={{paddingBottom: 10}}>{card?.desc.length ? card.desc : '-'}</Text>
                <Text style={styles.cardHeader}>Balance</Text>
                <Text style={styles.cardInfo}>${card?.balance}</Text>
                <Text style={styles.cardHeader}>Expiry</Text>
                <Text style={styles.cardInfo}>{card?.expiryDate ?? '-'}</Text>
                <Text style={styles.cardHeader}>Last Used</Text>
                <Text style={styles.cardInfo}>{card?.lastUsed ?? '-'}</Text>
                <View style={{flexGrow: 1}}></View>

                <Text style={styles.lastCheck}>Last Checked: {card?.lastChecked ?? '-'}</Text>
                <Button title='Check Balance' onPress={() =>{ 
                    router.push({pathname: 'card/check', params: {index}})
                }}></Button>
            </View>
        </Pressable>
    )
}

//<Button title='Delete Card' onPress={() =>{ 
//                    deleteCard(id)
//                    deleteCardState(id)
//                    router.back()
//                }}></Button>
const styles = StyleSheet.create({
    cardPage: {
        //alignItems: 'center',
        justifyContent: 'flex-start',
        flex: 1,
        padding: 20
    },
    cardHeader: {
        fontWeight: "600",
        fontSize: 20,
    },
    cardPin: {
        fontSize: 20,
        paddingBottom: 10
    },
    cardInfo: {
        fontSize: 20,
        paddingBottom: 10
    },
    lastCheck: {
        paddingBottom: 10,
        textAlign: "center",
        fontSize: 15
    }
})