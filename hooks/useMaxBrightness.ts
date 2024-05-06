/**
 * Screen brightness utility.
 */

import { useIsFocused } from "@react-navigation/core";
import * as Brightness from "expo-brightness";
import { useEffect, useState, useRef } from "react";
import { Platform } from "react-native";

/**
 * Used: https://gist.github.com/cr0ybot/fb6a251ac57e6eac469feee208d0d622
 * Set screen to max brightness when component is mounted and React Navigation screen is focused.
 * 
 * To use a state value during cleanup you need to use ref:
 * https://www.timveletta.com/blog/2020-07-14-accessing-react-state-in-your-component-cleanup-with-hooks/
 */
export function useMaxBrightness(disabled: boolean = false) {
	const [originalBrightness, setOriginalBrightness] = useState<number | null>(
		null
	);
    const brightnessRef = useRef(null)
	const isFocused = useIsFocused();

	const maxBrightness = async () => {
		if (originalBrightness !== null) return;

		console.log("Setting brightness to max...");

		// Save original brightness.
		const currentBrightness = await Brightness.getBrightnessAsync();
		console.log("currentBrightness", currentBrightness);

		setOriginalBrightness(currentBrightness);

		// Set brightness to max.
		await Brightness.setBrightnessAsync(1);
	};

	const resetBrightness = async () => {
        if (brightnessRef.current === null) return;

		console.log("Resetting brightness to original value...", brightnessRef.current);

		if (Platform.OS === "android") {
			Brightness.restoreSystemBrightnessAsync();
		} else {
			Brightness.setBrightnessAsync(brightnessRef.current);
		}
        
		setOriginalBrightness(null);
	};

    useEffect(() => {
        brightnessRef.current = originalBrightness
    }, [originalBrightness]);

	useEffect(() => {
		if (disabled) {
			if (originalBrightness !== null) resetBrightness();
			return;
		}
		if (isFocused) {
			maxBrightness();
		} else {
			resetBrightness();
		}
        // Cleanup resets brightness to original value when component is unmounted.
		return () => {
			resetBrightness();
		};

	}, [disabled, isFocused]);
}

export default useMaxBrightness;