import { CameraView, CameraType, useCameraPermissions } from 'expo-camera/next';
import { useState } from 'react';
import { Button, StyleSheet, Text, View, Dimensions } from 'react-native'
import { useRouter } from 'expo-router';
import { FAB } from 'react-native-paper';
import { useCardCollectionStore } from '../store/card';

export default function BarcodeCamera() {
    const router = useRouter()


    const setCardNum = useCardCollectionStore((state) => state.addCardNum)
    const [facing, setFacing] = useState('back' as any);
    const [permission, requestPermission] = useCameraPermissions();
    const windowWidth = Dimensions.get('window').width
    const windowHeight = (windowWidth / 3) * 4

    if (!permission) {
        // Camera permissions are still loading
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet
        return (
        <View style={styles.container}>
            <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
            <Button onPress={requestPermission} title="grant permission" />
        </View>
        );
    }

    return (
        <View style={styles.container}>
        <CameraView 
            style={[styles.camera, {width: windowWidth, height: windowHeight}]} 
            facing={facing}
            barcodeScannerSettings={{
                barcodeTypes: ['code128', 'ean13']
            }}
            onBarcodeScanned={(scanningResult) => {
                console.log(scanningResult.data)
                setCardNum(scanningResult.data)
                router.back()
            }}
        >
        </CameraView>
        <FAB
            icon="image"
            style={styles.fab}
        />
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  camera: {
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: 'transparent'
  },
  button: {
    alignSelf: 'flex-end',
    alignContent: 'center',
    textAlign: 'center'
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 5,
  }
});
