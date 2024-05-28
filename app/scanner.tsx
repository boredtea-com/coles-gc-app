import { CameraView, CameraType, useCameraPermissions, Camera, BarcodeScanningResult} from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, View, Dimensions } from 'react-native'
import { useRouter } from 'expo-router';
import { FAB, Snackbar } from 'react-native-paper';
import { useCardCollectionStore } from '../store/card';
import * as ImagePicker from 'expo-image-picker';

export default function BarcodeCamera() {
    const [visibleSnack, setVisibleSnack] = useState(false)
    const [snackMessage, setSnackMessage] = useState('')
    const onDismissSnackBar = () => setVisibleSnack(false);

    const router = useRouter()
    const setCardNum = useCardCollectionStore((state) => state.addCardNum)
    const [facing, setFacing] = useState('back' as any);
    const [permission, requestPermission] = useCameraPermissions();
    const windowWidth = Dimensions.get('window').width
    const windowHeight = (windowWidth / 3) * 4

    const decode = async () => {
      try {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
         if (status === 'granted') {
           const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              //allowsEditing: true,
              //aspect: [4, 3],
              quality: 1,
           })
           if (result && result.assets.length) {
              const results: BarcodeScanningResult[] = await Camera.scanFromURLAsync(result.assets[0].uri, ["code128", "ean13"]) as any

              if(!results || results && !results.length) {
                setSnackMessage('No barcodes detected in photo')
                setVisibleSnack(true)
              } else {
                setCardNum(results[0].data)
                router.back()
              }
           }
         }
      } catch (error) {
        console.debug(error)
      }
    }

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
            onPress={() => decode()}
        />
        <Snackbar
          visible={visibleSnack}
          onDismiss={onDismissSnackBar}
          action={{
            label: 'Dismiss',
            onPress: () => {
              // Do something
            },
          }}>
          {snackMessage}
        </Snackbar>
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
