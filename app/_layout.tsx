import { Button, Pressable, Text, View, useColorScheme } from "react-native";
import { Stack, SplashScreen } from "expo-router";
import { MD3DarkTheme, MD3LightTheme, PaperProvider, adaptNavigationTheme, useTheme } from 'react-native-paper';
import CustomNavigationBar from "@components/CustomNavigationBar";
import {
    ThemeProvider,
    DarkTheme as NavigationDarkTheme,
    DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import merge from 'deepmerge';

const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
  });

const CombinedDefaultTheme = merge(MD3LightTheme, LightTheme);
const CombinedDarkTheme = merge(MD3DarkTheme, DarkTheme);

SplashScreen.preventAutoHideAsync();


export default function HomeLayout() {
    return (
        <PaperProvider theme={CombinedDarkTheme}>
            <ThemeProvider value={CombinedDarkTheme}>
                <View style={{ flex: 1}}>
                    <Stack screenOptions={{
                        header: (props: any) => <CustomNavigationBar {...props} />
                    }}>
                        <Stack.Screen
                            name="index" // This is the name of the page and must match the url from root
                            options={{
                                title: "Gift Cards",
                                animation: 'ios'
                            }}      
                        />
                        <Stack.Screen
                            name="about" // This is the name of the page and must match the url from root
                            options={{
                                title: "About",
                                animation: 'ios'
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
                                title: "Add Card",
                                animation: 'ios'
                            }}
                        />
                        <Stack.Screen
                            name="card/check" // This is the name of the page and must match the url from root,
                            options={{
                                title: "Check Balance",
                                animation: 'ios'
                            }}
                        />
                        <Stack.Screen
                            name="card/transaction" // This is the name of the page and must match the url from root,
                            options={{
                                title: "Card Transaction History",
                                animation: 'ios'
                            }}
                        />
                        <Stack.Screen
                            name="camera" // This is the name of the page and must match the url from root
                            options={{
                                animation: 'ios'
                            }} 
                        />
                    </Stack>
                </View>
            </ThemeProvider>
        </PaperProvider>
    )
}