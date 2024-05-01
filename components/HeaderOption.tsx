import { useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native"
import { AntDesign } from "@expo/vector-icons"
import Menu from "./CustomMenu";

export default function HeaderOption() {
    const [triggerSetting, setTriggerSetting] = useState(false)

    return(
        <Pressable style={style.setting} onPress={(e) => setTriggerSetting(!triggerSetting)}>
            <AntDesign name="ellipsis1" size={24} color={"black"} />
            {triggerSetting && <Menu/>}
        </Pressable>
    )
}

const style = StyleSheet.create({
    setting: {
        position:"absolute",
        overflow: 'visible'
    }
})