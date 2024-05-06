import { FlashList } from "@shopify/flash-list";
import CardItem from "./CardItem";
import { StyleSheet } from "react-native";
import Divider from "./Divider";
import { cards, cardsList } from "../lib/db";
import { useState } from "react";


export default function CardList({ cards }: { cards: cardsList[]}) {
    const [editList, setEditList] = useState(false)
    return (
        <FlashList
            data={cards}
            renderItem={({item, index}) => <CardItem  card={item} index={index} editList={editList}/>}
            keyExtractor={card => card.id.toString()}
            estimatedItemSize={64}
            extraData={editList}
        />
    )
}