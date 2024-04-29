import { StatusBar } from 'expo-status-bar';
import { Button, FlatList, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { useCallback, useEffect, useState } from 'react'
import CardList from '@components/CardList'
import Menu from '@components/Menu'
import { FAB } from "react-native-paper"
import { router, useFocusEffect } from 'expo-router'
import { createTable, getCards, createCard, deleteCard } from '../lib/db';

export default function App() {
  const [data, setCards] = useState([])

  const nextId = (data[data.length -1]?.id ?? 0) + 1

  useFocusEffect(
    useCallback(() => {
      createTable()
      getCards(setCards)
    }, [])
  )

  return (
    <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={{padding: 10}}></View>
        <CardList cards={data}/>
        <FAB
            icon="plus"
            style={styles.fab}
            onPress={() => router.push({pathname:'/card/add', params: {nextId}})}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    bottom: 0,
  }
});
