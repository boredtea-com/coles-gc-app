import { Button, FAB, HelperText, RadioButton, TextInput } from "react-native-paper"
import { StyleSheet, Text, View } from "react-native"
import { useState } from "react"
import { createCard } from "../../lib/db"
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router"

let size = {
  gc: {
    min: 16,
    max: 20
  },
  flybuys: {
    min: 13
  }
}

export default function addCard () {
  const navigation = useNavigation()
  const params = useLocalSearchParams()

  const {nextId} = params

  const [cardType, setCardType] = useState('gc')
  const [cardNum, setCardNum] = useState('')
  const [cardName, setCardName] = useState('')
  const [cardBalance, setCardBalance] = useState('')
  const [cardDesc, setCardDesc] = useState('')
  const [cardPin, setCardPin] = useState('')

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
        hasError: cardNum.length < size.gc.min || cardNum.length > size.gc.max,
        message: `Card number must be between ${size.gc.min} and ${size.gc.max} digits`
      }
    } else {
      return {
        hasError: cardNum.length < size.flybuys.min,
        message: `Card number must be at least ${size.flybuys.min} digits`
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

    createCard(data)
  }

  return (
      <View style={styles.addPage}>
        <View style={{paddingBottom: 15}}>
          <RadioButton.Group onValueChange={value => setCardType(value)} value={cardType}>
            <RadioButton.Item label="Gift Card" value="gc" />
            <RadioButton.Item label="Flybuys" value="flybuys" />
          </RadioButton.Group>
        </View>
        
        <TextInput
          left={<TextInput.Icon icon={cardType == "gc" ? "wallet-giftcard" :"text-account"} />}
          label={"Card Name"}
          value={cardName}
          mode="flat"
          onChangeText={text => setCardName(text)}
          style={styles.cardName}
        />
        

        <TextInput
          left={<TextInput.Icon icon={"card-text"} />}
          right={<TextInput.Icon icon={"camera-iris"}/>}
          label={"Card Number*"}
          value={cardNum}
          mode="outlined"
          onChangeText={text => setCardNum(text)}
          keyboardType="number-pad"
        />
        <HelperText type="error" visible={hasErrors().hasError}>
          {hasErrors().message ?? ''}
        </HelperText>

        <TextInput
          left={<TextInput.Icon icon={"text-short"} />}
          label={"Card Description"}
          value={cardDesc}
          mode="outlined"
          onChangeText={text => setCardDesc(text)}
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
            /> 
            <TextInput
              left={<TextInput.Icon icon={"text-short"} />}
              label={"Card Pin"}
              value={cardPin}
              mode="outlined"
              onChangeText={text => setCardPin(text)}
              maxLength={4}
              keyboardType="number-pad"
            /> 
          </View>
        }
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
  cardName: {
    marginBottom: 30
  },
  submitButton: {
    position: "absolute",
    bottom: 20,
    right: 10
  }
})