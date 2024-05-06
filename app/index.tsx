import { StatusBar } from 'expo-status-bar';
import { Button, FlatList, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { useCallback, useEffect, useState } from 'react'
import CardList from '@components/CardList'
import Menu from '@components/CustomMenu'
import { FAB, useTheme } from "react-native-paper"
import { SplashScreen, router, useFocusEffect } from 'expo-router'
import { createTable, getCards, createCard, deleteCard } from '../lib/db';
import { useCardCollectionStore } from '../store/card';

export default function App() {
  const cards = useCardCollectionStore((state) => state.cards)
  const setCards =  useCardCollectionStore((state) => state.setCards)

  useEffect(() => {
    createTable()
    getCards(setCards)
  }, [])


  return (
    <View style={[styles.container]}>
        <StatusBar style="auto" />
        <View style={{padding: 10}}></View>
        <CardList cards={cards}/>
        <FAB
            icon="plus"
            style={styles.fab}
            onPress={() => router.push({pathname:'/card/add', params: {}})}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontFamily: 'monospace'
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 5,
  }
});
