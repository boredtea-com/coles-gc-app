import { FlashList } from "@shopify/flash-list";
import CardItem from "./CardItem";
import { StyleSheet } from "react-native";
import Divider from "./Divider";
import { cards } from "../lib/db";


export default function CardList({ cards }: { cards: cards[]}) {
    return (
        <FlashList
            data={cards}
            renderItem={({item}) => <CardItem {...item}/>}
            keyExtractor={card => card.id.toString()}
            estimatedItemSize={64}
        />
    )
}