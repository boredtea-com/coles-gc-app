import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { Button, Image, Pressable, StyleSheet, Text, View } from "react-native"
import { cards, createTransactions, deleteCard, getTransactions, transaction, updateCard } from "../../lib/db";
import { useCardCollectionStore, useCardStore } from "../../store/card";
import { WebView } from 'react-native-webview';
import { useEffect } from "react";

export default function Check() {
    let webview: WebView | null = null
    const router = useRouter()
    const params: Partial<{ index: number }> = useLocalSearchParams()
    const setCard = useCardStore((store) => store.setCard)
    const card = useCardStore((state) => state.card)

    const updateCardBalance = useCardCollectionStore((store) => store.updateCard)

    const { index } = params

    const runFirst = `
        document.getElementById("cardNumber").scrollIntoView();
        document.querySelector("#cardNumber").value = '${card.number.slice(card.number.length - 17)}';
        document.querySelector("#cardPIN").value = ${card.pin};
        true; // note: this is required, or you'll sometimes get silent failures
    `;

    const INJECTED_JAVASCRIPT = `(function() {
        let summary = document.querySelector("table.gift-card-summary__tableContent");
        let td = summary.getElementsByTagName("td");
        let balance = td[0].innerText;
        let expiryDate = td[4].innerText;
        let status = td[5].innerText;

        let transactionHistory = document.querySelector("#transaction-history > tbody").getElementsByTagName("tr");
        let translatedHistory = [];

        for(let i = 0; i < transactionHistory.length; i++) {
            let tr = transactionHistory[i];
            let transHistTD = tr.getElementsByTagName("td");
            let history = {};
            
            for(let x = 0; x < transHistTD.length; x++) {
                let elem = transHistTD[x]
                let split = elem.innerText.split("\\n");
                history[split[0].toLowerCase()] = split[1];
            }
            translatedHistory.push(history);
        }

        window.ReactNativeWebView.postMessage(JSON.stringify({type: "summary", balance, expiryDate, status, translatedHistory}));
    })();`;

    const updateCardDetails = (data) => {
        let newBalance = parseFloat(data.balance?.slice(1)) ?? card.balance
        let newExpiryDate = data.expiryDate ?? card.expiryDate
        let newLastUsed = card.lastUsed

        const translatedHistory: (Omit<transaction, "id" |'cardid' | "desc"> & {description: string}) [] = data?.translatedHistory ?? []
        const translationHistory: transaction[] = translatedHistory.map((item, index) => ({...item, id: card.id.toString() + index, cardid: card.id, desc: item.description}))

        if(translatedHistory.length > 1) newLastUsed = translatedHistory[translatedHistory.length - 1]?.date ?? newLastUsed

        updateCard(card.id, newBalance, newExpiryDate, newLastUsed, setCard)
        updateCardBalance(index, {balance: newBalance})
        createTransactions(card.id, translationHistory)
        router.back()
    }

    const handleWebViewNavigationStateChange = (newNavState) => {
        const { url } = newNavState;
        if (!url) return;

        if (url.includes("TransactionHistory")) {
            webview.injectJavaScript(INJECTED_JAVASCRIPT)
        }
    }

    return (
        <WebView
            ref={(ref) => (webview = ref)}
            style={styles.container}
            source={{ uri: 'https://www.giftcards.com.au/CheckBalance' }}
            injectedJavaScript={runFirst}
            onNavigationStateChange={handleWebViewNavigationStateChange}
            onMessage={(event) => {
                let data = JSON.parse(event.nativeEvent.data)
                if (data?.type == "summary") {
                    updateCardDetails(data)
                }
            }}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})