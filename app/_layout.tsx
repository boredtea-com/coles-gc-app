import { Button, Pressable, Text, View, useColorScheme } from "react-native";
import Constants from "expo-constants"
import { Slot, Stack } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import HeaderOption from "../components/HeaderOption";
import { DarkTheme, LightTheme } from "../lib/theme"
import { PaperProvider } from 'react-native-paper';
import Menu from "@components/Menu";

export default function HomeLayout() {
    return (
        <PaperProvider>
            <View style={{ flex: 1 }}>
                <Stack screenOptions={{
                    headerRight: () => <HeaderOption />
                }}>
                    <Stack.Screen
                        name="index" // This is the name of the page and must match the url from root
                        options={{
                            title: "Gift Cards"
                        }}      
                    />
                    <Stack.Screen
                        name="about" // This is the name of the page and must match the url from root
                        options={{
                            title: "About"
                        }} 
                    />
                    <Stack.Screen
                        name="card/index" // This is the name of the page and must match the url from root,
                        // @ts-ignore
                        options={({ route }) => ({ title: route.params.name })}
                    />
                    <Stack.Screen
                        name="card/add" // This is the name of the page and must match the url from root,
                        options={{
                            title: "Add Card"
                        }}
                    />
                </Stack>
            </View>
        </PaperProvider>
    )
}