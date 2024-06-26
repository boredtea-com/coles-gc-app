import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useCardCollectionStore, useCardStore } from "../../store/card";
import CardForm from "@components/CardForm";
import { useEffect, useState } from "react";
import { cards, editCard } from "../../lib/db";
import { View, StyleSheet } from "react-native";


export default function Check() {
    const router = useRouter()
    const params: Partial<{ index: number}> = useLocalSearchParams()
    const setCardStore = useCardStore((store) => store.setCard)
    const cardStored = useCardStore((state) => state.card)

    const [card, setCard] = useState({...cardStored , pin: String(cardStored.pin ?? ''), balance: String(cardStored.balance ?? '')})


    const cardNum = useCardCollectionStore((state) => state.cardNum)
    const setCardNum = useCardCollectionStore((state) => state.addCardNum)
    const updateCardsArray = useCardCollectionStore((state) => state.updateCard)

    const updateCardData = (data: any) => setCard({...card, ...data})

    useEffect(() => setCardNum(card.number), [])


    const onSubmit = () => {
        let data = {...card, pin: card.pin ? card.pin : undefined, balance: card.balance ? Number(card.balance) : undefined, number: cardNum}
        editCard(data, setCardStore)
        updateCardsArray(params.index, data)
        router.back()
    }

    return (
        <View style={styles.editPage}>
            <CardForm card={card} cardNum={cardNum} setCardNum={setCardNum} onSubmit={onSubmit} updateCard={updateCardData}/>
        </View>
    )

}

const styles = StyleSheet.create({
    editPage: {
      padding: 10,
      flex: 1
    }
  })