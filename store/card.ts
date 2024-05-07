import { create } from "zustand"
import { cards, cardsList } from "../lib/db"

type transactionHistory = {
    Date?: string,
    Description?: string,
    Store?: string,
    Amount?: string,
    Balance?: string,
}

interface CardCollectionState {
    cardNum: string
    cards: cardsList[]
    addCardNum: (by: string) => void
    setCards: (cards: cards[]) => void
    addCard: (card: cards) => void
    deleteCard: (id: number) => void
    updateCard: (index: number, data) => void
}

interface CardState {
    card: cards | null
    transactionHistory: transactionHistory[]
    setCard: (card) =>  void
}


export const useCardCollectionStore = create<CardCollectionState>((set) => ({
    cardNum: '',
    cards: [],
    addCardNum: (by) => set((state) => ({cardNum: by})),
    setCards: (cards) =>  set((state) => ({cards: cards})),
    addCard: (card) =>  set((state) => {
        if(card.type == 'gc') return {cards: [...state.cards, card]}
        
        let cards = [...state.cards]
        let flybuysLast = cards.findLastIndex(o => o.type === 'flybuys') + 1

        cards.splice(flybuysLast, 0, card)

        return {cards: cards}
    }),
    deleteCard: (id) =>  set((state) => ({cards: [...state.cards].filter(o => o.id != id)})),
    updateCard: (index, data) => set((state) => {
        let cards = [...state.cards]
        cards[index] = {...cards[index], ...data}

        return {cards: cards}
    })
}))


export const useCardStore = create<CardState>((set) => ({
    card: null,
    transactionHistory: [],
    setCard: (card) =>  set((state) => ({card: card})),
}))