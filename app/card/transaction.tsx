import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { getTransactions, transaction } from "../../lib/db";
import { FlashList } from "@shopify/flash-list";
import { Card, Text } from "react-native-paper";


export default function TransactionHistory() {
    const [transactions, setTransactions] = useState([])
    const router = useRouter()
    const params = useLocalSearchParams()

    const { id } = params

    useEffect(() => {
        getTransactions(id, setTransactions)
    }, [])

    const transactionItem = (transaction: transaction) => {
        return (
            <Card style={{margin: 8, padding: 10}}>
                <Text style={styles.text}>Store: {transaction.store}</Text>
                <Text style={styles.text}>Description: {transaction.desc}</Text>
                <Text style={styles.text}>Amount: {transaction.amount}</Text>
                <Text style={styles.text}>Balance: {transaction.balance}</Text>
                <Text style={styles.text}>Date: {transaction.date}</Text>
            </Card>
        )
    }
    
    return (
        <FlashList
            data={transactions}
            renderItem={({item, index}) => transactionItem(item)}
            keyExtractor={card => card.id.toString()}
            estimatedItemSize={64}
        />
    )
}

const styles = StyleSheet.create({
    text: {
        fontSize: 17
    }
})