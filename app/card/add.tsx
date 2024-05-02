import { RadioButton, Text } from "react-native-paper"
import { StyleSheet, View } from "react-native"
import { useEffect, useState } from "react"
import { createCard } from "../../lib/db"
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router"
import { useCardCollectionStore } from "../../store/card"
import CardForm from "@components/CardForm"

export default function addCard () {
  const navigation = useNavigation()
  const params = useLocalSearchParams()

  const {nextId} = params
  const [card, setCard] = useState({
    type: 'gc',
    name: '',
    desc: '',
    balance: '',
    pin: ''
  } as any)

  const updateCard = (data: any) => setCard({...card, ...data})

  const cardNum = useCardCollectionStore((state) => state.cardNum)
  const setCardNum = useCardCollectionStore((state) => state.addCardNum)
  const addNewCard = useCardCollectionStore((state) => state.addCard)

  useEffect(() => setCardNum(''), [])

  const onSubmit = () => {
    addCard()
    navigation.dispatch({type: 'POP_TO_TOP'})
  }


  const addCard = () => {
    let data = {
      ...card,
      name: card.name.length ? card.name : `Card ${nextId}`,
      number: cardNum
    }
    createCard(data, addNewCard)
  }

  return (
      <View style={styles.addPage}>
        <View style={{paddingBottom: 15, flexDirection: "row", justifyContent: 'space-around', width: '100%'}}>
          <View style={{flexDirection: "row", alignItems: 'center'}}>
            <Text>Gift Card</Text>
            <RadioButton value="gc" status={ card.type === 'gc' ? 'checked' : 'unchecked' } onPress={() => updateCard({type: 'gc'})}/>
          </View>
          <View style={{flexDirection: "row", alignItems: 'center'}}>
            <Text>FlyBuys</Text>
            <RadioButton value="flybuys" status={ card.type === 'flybuys' ? 'checked' : 'unchecked'  } onPress={() => updateCard({type:'flybuys'})} />
          </View>
        </View>

        <CardForm card={card} cardNum={cardNum} setCardNum={setCardNum} onSubmit={onSubmit} updateCard={updateCard}/>
      </View>
  )
}

const styles = StyleSheet.create({
  addPage: {
    padding: 10,
    flex: 1
  }
})