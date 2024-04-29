import { StyleSheet, Text, View } from "react-native";



export default function MenuOptions () {
    return (
        <View style={styles.menuOptionWrapper}>
            <Text>About</Text>
            <Text>Settings</Text>
        </View>
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