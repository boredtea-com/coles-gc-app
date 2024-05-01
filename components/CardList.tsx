import { FlashList } from "@shopify/flash-list";
import CardItem from "./CardItem";
import { StyleSheet } from "react-native";
import Divider from "./Divider";
import { cards, cardsList } from "../lib/db";


export default function CardList({ cards }: { cards: cardsList[]}) {
    return (
        <FlashList
            data={cards}
            renderItem={({item, index}) => <CardItem  card={item} index={index}/>}
            keyExtractor={card => card.id.toString()}
            estimatedItemSize={64}
        />
    )
}