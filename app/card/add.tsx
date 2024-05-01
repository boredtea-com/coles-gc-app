import { Button, FAB, HelperText, RadioButton, TextInput, Text } from "react-native-paper"
import { StyleSheet, View } from "react-native"
import { useEffect, useState } from "react"
import { createCard } from "../../lib/db"
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router"
import { useCardCollectionStore } from "../../store/card"

let size = {
  gc: 30,
  flybuys: 13
}

export default function addCard () {
  const navigation = useNavigation()
  const router = useRouter()

  const params = useLocalSearchParams()

  const {nextId, cameraNum} = params

  const [cardType, setCardType] = useState('gc')
  const [cardName, setCardName] = useState('')
  const [cardBalance, setCardBalance] = useState('')
  const [cardDesc, setCardDesc] = useState('')
  const [cardPin, setCardPin] = useState('')

  const cardNum = useCardCollectionStore((state) => state.cardNum)
  const setCardNum = useCardCollectionStore((state) => state.addCardNum)
  const addNewCard = useCardCollectionStore((state) => state.addCard)

  useEffect(() => {
    setCardNum('')
  }, [])

  const hasErrors = () => {
    let isnum = /^\d+$/.test(cardNum);
    if(cardNum.length && !isnum) {
      return {
        hasError: true,
        message: `Card number must only be digits`
      }
    }

    if(cardType == "gc") {
      return {
        hasError: cardNum.length != size.gc,
        message: `Card number must ${size.gc} digits`
      }
    } else {
      return {
        hasError: cardNum.length < size.flybuys,
        message: `Card number must be at least ${size.flybuys} digits`
      }
    }
  };


  const addCard = () => {
    let data = {
      name: cardName.length ? cardName : `Card ${nextId}` ,
      type: cardType,
      number: cardNum,
      balance: cardBalance,
      desc: cardDesc,
      pin: cardPin
    }

    createCard(data, addNewCard)
  }

  return (
      <View style={styles.addPage}>
        <View style={{paddingBottom: 15, flexDirection: "row", justifyContent: 'space-around', width: '100%'}}>
          <View style={{flexDirection: "row", alignItems: 'center'}}>
            <Text>Gift Card</Text>
            <RadioButton value="gc" status={ cardType === 'gc' ? 'checked' : 'unchecked' } onPress={() => setCardType('gc')}/>
          </View>
          <View style={{flexDirection: "row", alignItems: 'center'}}>
            <Text>FlyBuys</Text>
            <RadioButton value="flybuys" status={ cardType === 'flybuys' ? 'checked' : 'unchecked'  } onPress={() => setCardType('flybuys')} />
          </View>
        </View>
        
        <TextInput
          left={<TextInput.Icon icon={cardType == "gc" ? "wallet-giftcard" :"text-account"} />}
          label={"Card Name"}
          value={cardName}
          mode="flat"
          onChangeText={text => setCardName(text)}
          style= {styles.textInput}
        />
        

        <TextInput
          left={<TextInput.Icon icon={"card-text"} />}
          right={<TextInput.Icon icon={"camera-iris"} onPress={() => {router.push("/camera")}}/>}
          label={"Card Number*"}
          value={cardNum}
          mode="outlined"
          onChangeText={text => setCardNum(text.replaceAll(" ", ""))}
          keyboardType="number-pad"
        />

        <TextInput
          left={<TextInput.Icon icon={"text-short"} />}
          label={"Card Description"}
          value={cardDesc}
          mode="outlined"
          onChangeText={text => setCardDesc(text)}
          style= {styles.textInput}
        />

        {
          cardType == "gc" && 
          <View>
            <TextInput
              left={<TextInput.Icon icon={"cash"} />}
              label={"Card Balance"}
              value={cardBalance}
              mode="outlined"
              onChangeText={text => setCardBalance(text)}
              keyboardType="number-pad"
              style= {styles.textInput}
            /> 
            <TextInput
              left={<TextInput.Icon icon={"text-short"} />}
              label={"Card Pin"}
              value={cardPin}
              mode="outlined"
              onChangeText={text => setCardPin(text)}
              maxLength={4}
              keyboardType="number-pad"
              style= {styles.textInput}
            /> 
          </View>
        }

        <HelperText type="error" visible={hasErrors().hasError}>
          {hasErrors().message ?? ''}
        </HelperText>

        <Button mode="contained" style={styles.submitButton} disabled={hasErrors().hasError} onPress={() => {
          addCard()
          navigation.dispatch({type: 'POP_TO_TOP'})
        }}>
          Submit
        </Button>
      </View>
  )
}

const styles = StyleSheet.create({
  addPage: {
    padding: 10,
    flex: 1
  },
  textInput: {
    marginBottom: 2
  },
  submitButton: {
    position: "absolute",
    bottom: 20,
    right: 10
  }
})