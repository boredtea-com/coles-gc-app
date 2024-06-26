import React, { useEffect, useState } from "react"
import { Pressable, View, Text, StyleSheet } from "react-native"
import 'react-zlib-js' // side effects only
import bwipjs from 'bwip-js';
import { Image } from 'expo-image';
import * as Clipboard from 'expo-clipboard';
import {Buffer} from "buffer"
import useMaxBrightness from "../hooks/useMaxBrightness";


const BarCode = async (options) => {
    let svg = null
    try {
        //@ts-ignore
        svg = bwipjs.toSVG(options)
        let [ , w, height ] = /viewBox="0 0 (\d+) (\d+)"/.exec(svg);
        const buff = Buffer.from(svg);
        const base64data = buff.toString('base64');
        return (
            <Image
                style={{ height: Number(height), width:'100%', backgroundColor: '#ffffff'}}
                source={`data:image/svg+xml;base64,${base64data}`}
            />
        );
    } catch (e) {
        // `e` may be a string or Error object
        return (
            <Text style={{textAlign: "center"}}>Unable to show barcode</Text>
        )
    }
};

export default function Barcode({
    barcode,
    scale,
    height,
    type
}) {
    let [img, setImg] = useState(null)
    const [triggerBrightness, setTriggerBrightness] = useState(false)
    useMaxBrightness(!triggerBrightness)

    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(barcode as string);
    };


    useEffect(() => {
        (async () => {
            let bcid = type === 'gc' ? 'code128' : 'ean13'
            setImg(await BarCode({text: barcode, scale, height,  bcid: bcid}))
        })()
    }, [barcode])

    return (
        <View style={styles.barcodeWrapper}>
            <Pressable style={{width: '99%', justifyContent: 'center'}} onPress={() => setTriggerBrightness(!triggerBrightness)}>
                {img ?? <Text style={{textAlign: "center"}}>Cannot show image</Text>}
            </Pressable>
            <Pressable onPress={copyToClipboard}>
                    <Text style={styles.cardNo}>{barcode}</Text> 
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    barcodeWrapper: {
        alignItems: 'center',
        paddingBottom: 20,
        backgroundColor: "#fff",
        borderColor: '#fff',
        borderWidth: 1,
        borderRadius: 3,
        paddingTop: 30,
    },
    cardNo: {
        paddingTop: 10,
        fontSize: 15,
        fontWeight: '100'
    },
})