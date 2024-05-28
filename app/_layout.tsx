import { View, Appearance } from "react-native";
import { Stack } from "expo-router";
import { MD3DarkTheme, MD3LightTheme, PaperProvider, adaptNavigationTheme } from 'react-native-paper';
import CustomNavigationBar from "@components/CustomNavigationBar";
import {
    ThemeProvider,
    DarkTheme as NavigationDarkTheme,
    DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import merge from 'deepmerge';
import { useCallback, useEffect, useMemo, useState } from "react";
import { PreferencesContext } from "../lib/preference";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
  });

const CombinedDefaultTheme = merge(MD3LightTheme, LightTheme);
const CombinedDarkTheme = merge(MD3DarkTheme, DarkTheme);

export default function HomeLayout() {
    const [isThemeDark, setIsThemeDark] = useState(false)

    let theme = isThemeDark ? CombinedDarkTheme : CombinedDefaultTheme;

    useEffect(() => {
        const getTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem('isDarkMode')
                if(savedTheme) {
                    setIsThemeDark(savedTheme === "true")
                }
                Appearance.setColorScheme(savedTheme === "true" ? 'dark' : 'light')
                await SplashScreen.hideAsync()
            } catch (error) {
                console.log("Error loading theme", error)
            }
        }
        getTheme()
    }, [])

    const toggleTheme = useCallback(() => {
        setIsThemeDark(!isThemeDark)
        AsyncStorage.setItem('isDarkMode', !isThemeDark ? 'true' : 'false')
        Appearance.setColorScheme(!isThemeDark ? 'dark' : 'light')
    }, [isThemeDark]);

    const preferences = useMemo(
        () => ({
            toggleTheme,
            isThemeDark,
        }),
        [toggleTheme, isThemeDark]
    );

    return (
        <PreferencesContext.Provider value={preferences}>
            <PaperProvider theme={theme}>
                <ThemeProvider value={theme}>
                    <View style={{ flex: 1}}>
                        <Stack screenOptions={{
                            header: (props: any) => <CustomNavigationBar {...props} />
                        }}>
                            <Stack.Screen
                                name="index" 
                                options={{
                                    title: "Gift Cards",
                                    animation: 'ios'
                                }}      
                            />
                            <Stack.Screen
                                name="about" 
                                options={{
                                    title: "About",
                                    animation: 'ios'
                                }} 
                            />
                            <Stack.Screen
                                name="card/index"
                                // @ts-ignore
                                options={({ route }) => ({ title: route.params.name, animation: 'ios' })}
                            />
                            <Stack.Screen
                                name="card/add"
                                options={{
                                    title: "Add Card",
                                    animation: 'ios'
                                }}
                            />
                            <Stack.Screen
                                name="card/check"
                                options={{
                                    title: "Check Balance",
                                    animation: 'ios'
                                }}
                            />
                            <Stack.Screen
                                name="card/edit"
                                options={{
                                    title: "Edit Card",
                                    animation: 'ios'
                                }}
                            />
                            <Stack.Screen
                                name="card/transaction"
                                options={{
                                    title: "Card Transaction History",
                                    animation: 'ios'
                                }}
                            />
                            <Stack.Screen
                                name="scanner" 
                                options={{
                                    title: "Scanner",
                                    animation: 'ios'
                                }} 
                            />
                        </Stack>
                    </View>
                </ThemeProvider>
            </PaperProvider>
        </PreferencesContext.Provider>
    )
}