import React, { createRef, useEffect, useLayoutEffect, useState } from "react"
import { Pressable, View, Text, StyleSheet, Dimensions } from "react-native"
import 'react-zlib-js' // side effects only
import { code128 } from 'bwip-js'
import bwipjs from 'bwip-js';
import { Image } from 'expo-image';
import * as Clipboard from 'expo-clipboard';
import {Buffer} from "buffer"


const BarCode = async (options) => {
    let svg = null
    try {
        //@ts-ignore
        svg = bwipjs.toSVG(options)
    } catch (e) {
        // `e` may be a string or Error object
    }
    //`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
    let [ , w, height ] = /viewBox="0 0 (\d+) (\d+)"/.exec(svg);
    const buff = Buffer.from(svg);
    const base64data = buff.toString('base64');
    return (
        <Image
            style={{ height: Number(height), width:'100%', backgroundColor: '#ffffff' }}
            source={`data:image/svg+xml;base64,${base64data}`}
        />
    );
};

export default function Barcode({
    barcode,
    scale,
    height
}) {
    let [img, setImg] = useState(null)
    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(barcode as string);
    };


    useEffect(() => {
        (async () => {
            setImg(await BarCode({text: barcode, scale, height,  bcid: 'code128'}))
        })()
    }, [])

    return (
        <View style={styles.barcodeWrapper}>
            <Pressable style={{width: '100%'}}>
                {img ?? <Text>Cannot show image</Text>}
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
        paddingBottom: 30,
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