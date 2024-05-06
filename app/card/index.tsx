import Barcode from "@components/Barcode";
import { Stack, useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { cards, cardsList, deleteCard, getCard } from "../../lib/db";
import { useCardCollectionStore, useCardStore } from "../../store/card";
import { useTheme, Button, Text, Menu } from "react-native-paper";
import CustomNavigationBar from "@components/CustomNavigationBar";
import CustomDialog from "@components/CustomDialog";

export default function Page() {
    const router = useRouter()
    const params: Partial<cardsList & {index: number}> = useLocalSearchParams()
    const { id, index } = params
    const [showDialog, setShowDialog] = useState(false)

    const deleteCardState = useCardCollectionStore((state) => state.deleteCard)
    const card = useCardStore((state) => state.card)

    const setCard = useCardStore((state) => state.setCard)

    useEffect(() => {
        getCard(id, setCard)
        return () => {
            //Clean card store
            setCard(null)
        }
    }, [])

    const [revealPin, setRevealPin] = useState(false)

    const menuItems = [
        {
            title: "Edit Card",
            onPress: () => {
                router.push({pathname: 'card/edit', params: {index}})
            }
        },
        {
            title: "Delete Card",
            onPress: () => {
                setShowDialog(true)
            }
        }
    ]

    if(card == null) {
        return (
            <View>
                <Text>Loading Card</Text>
            </View>
        )
    }

    return (
        <Pressable style={{flex: 1}} onPress={(e) => setRevealPin(!revealPin)}>
            <CustomDialog 
                visible={showDialog} 
                body={"Are you sure you want to delete this card?"} 
                completeText={'Delete'} 
                cancelPress={() => setShowDialog(false)}
                completeButton={() => { 
                    deleteCard(id)
                    deleteCardState(id)
                    router.back()
                }}
            />
            
            <Stack.Screen
                options={{
                    title: card.name,
                    animation: 'ios',
                    header: (props: any) => <CustomNavigationBar {...props} hasCustomMenu={true} menuItems={menuItems}  />
                }}
            />
            <View style={styles.cardPage}>
                <Barcode barcode={card.number} scale={2} height={15}/>
                <View style={{padding: 10}}></View>

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
                <Button 
                    mode="contained"
                    onPress={() => { 
                    router.push({pathname: 'card/check', params: {index}})
                }}>
                    Check Balance
                </Button> 
                <View style={{padding: 10}}></View>
                <Button
                    mode="contained"
                    onPress={() => { router.push({pathname: 'card/transaction', params: {id: card.id}})}}
                >
                    Show Transactions
                </Button>
            </View>
        </Pressable>
    )
}
const styles = StyleSheet.create({
    cardPage: {
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