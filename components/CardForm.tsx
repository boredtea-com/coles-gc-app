import { useRouter } from "expo-router"
import { useEffect } from "react"
import { View, StyleSheet } from "react-native"
import { Button, HelperText, RadioButton, TextInput, Text } from "react-native-paper"

let size = {
    gc: 30,
    flybuys: 13
}

export default function CardForm ({
    card,
    cardNum,
    setCardNum,
    updateCard,
    onSubmit
}) {
    const router = useRouter()

    const hasErrors = () => {
        let isnum = /^\d+$/.test(cardNum);
        if(cardNum.length && !isnum) {
          return {
            hasError: true,
            message: `Card number must only be digits`
          }
        }
    
        if(card.type == "gc") {
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


    return (
        <View style={{flex: 1}}>
        <TextInput
          left={<TextInput.Icon icon={card.Type == "gc" ? "wallet-giftcard" :"text-account"} />}
          label={"Card Name"}
          value={card.name}
          mode="flat"
          onChangeText={text => updateCard({name: text})}
          style= {styles.textInput}
        />
        

        <TextInput
          left={<TextInput.Icon icon={"card-text"} />}
          right={<TextInput.Icon icon={"camera-iris"} onPress={() => {router.push("/camera")}}/>}
          label={"Card Number*"}
          value={cardNum}
          mode="outlined"
          onChangeText={text => setCardNum(text)}
          keyboardType="number-pad"
        />

        <TextInput
          left={<TextInput.Icon icon={"text-short"} />}
          label={"Card Description"}
          value={card.desc}
          mode="outlined"
          onChangeText={text => updateCard({desc: text})}
          style= {styles.textInput}
        />

        {
          card.type == "gc" && 
          <View>
            <TextInput
              left={<TextInput.Icon icon={"cash"} />}
              label={"Card Balance"}
              value={card.balance}
              mode="outlined"
              onChangeText={text => updateCard({balance: text})}
              keyboardType="number-pad"
              style= {styles.textInput}
            /> 
            <TextInput
              left={<TextInput.Icon icon={"text-short"} />}
              label={"Card Pin"}
              value={card.pin}
              mode="outlined"
              onChangeText={text => updateCard({pin: text})}
              maxLength={4}
              keyboardType="number-pad"
              style= {styles.textInput}
            /> 
          </View>
        }

        <HelperText type="error" visible={hasErrors().hasError}>
          {hasErrors().message ?? ''}
        </HelperText>

        <Button mode="contained" style={styles.submitButton} disabled={hasErrors().hasError} onPress={onSubmit}>
          Submit
        </Button>
      </View>
    )
}

const styles = StyleSheet.create({
    textInput: {
      marginBottom: 2
    },
    submitButton: {
      position: "absolute",
      bottom: 20,
      right: 10
    }
  })