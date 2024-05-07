import { useRouter } from "expo-router";
import { useState } from "react";
import { Appbar, Menu } from "react-native-paper";



export default function CustomMenu ({menuItems}: {menuItems?: {onPress, title}[]}) {
    const router = useRouter()

    const [visible, setVisible] = useState(false)
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);
    
    const customMenuItems = menuItems?.map(o => 
        <Menu.Item
            onPress={() => {
                closeMenu()
                o.onPress()
            }}
            title={o.title}
            key={o.title}
        />
    )

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
            {customMenuItems ??
                <Menu.Item
                    onPress={() => {
                        closeMenu()
                        router.push("about")
                    }}
                    title="About"
                />
            }
        </Menu>
    )
}