

export const GenBarCode128 = async (options) => {
    let img = null;
    try {
        //@ts-ignore
        img = await code128(options);
    } catch (e) {
        // `e` may be a string or Error object
    }
    return img
}