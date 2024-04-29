import Barcode from "@components/Barcode";
import Divider from "@components/Divider";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, Image, Pressable, StyleSheet, Text, View } from "react-native";
import * as Brightness from 'expo-brightness';
import { cards, deleteCard } from "../../lib/db";

export default function Page() {
    const navigation = useNavigation()
    const router = useRouter()
    const params: Partial<cards> = useLocalSearchParams()

    const { name, balance, id, number, pin, desc, lastUsed, lastChecked } = params

    const [revealPin, setRevealPin] = useState(false)

    return (
        <Pressable style={{flex: 1}} onPress={(e) => setRevealPin(!revealPin)}>
            <View style={styles.cardPage}>
                <Barcode barcode={number} scale={2} height={15}/>
                <Divider dividerStyle={{marginBottom: 10}}/>
                <Text style={styles.cardHeader}>PIN</Text>
                <Text style={[styles.cardPin, {paddingBottom: 10}]}>{!revealPin ? '****' : pin}</Text>
                <Text style={styles.cardHeader}>Description</Text>
                <Text style={{paddingBottom: 10}}>{desc}</Text>
                <Text style={styles.cardHeader}>Balance</Text>
                <Text style={styles.cardAmount}>${balance}</Text>
                <View style={{flexGrow: 1}}></View>
                <Button title='Delete Card' onPress={() =>{ 
                    deleteCard(id)
                    router.back()
                }}></Button>

            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    cardPage: {
        //alignItems: 'center',
        justifyContent: 'flex-start',
        flex: 1,
        padding: 20
    },
    cardHeader: {
        fontWeight: '200',
        fontSize: 20,
    },
    cardPin: {
        fontSize: 20,
        paddingBottom: 10
    },
    cardAmount: {
        fontSize: 20,
    }
})