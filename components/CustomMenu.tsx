import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Appbar, Menu } from "react-native-paper";



export default function CustomMenu () {
    const router = useRouter()

    const [visible, setVisible] = useState(false)
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    return (
        <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={
                <Appbar.Action
                  icon="dots-vertical"
                  onPress={openMenu}
                />
              }
        >
            <Menu.Item
                onPress={() => {
                    closeMenu()
                    router.push("about")
                }}
                title="About"
            />

        </Menu>
    )
}


const styles = StyleSheet.create({
    menuOptionWrapper: {
        backgroundColor: '#d4d2d2',
        position: 'absolute',
        top: 25,
        right: 100,
        flex: 1,
        height: 100,
        width: 100
    }
})