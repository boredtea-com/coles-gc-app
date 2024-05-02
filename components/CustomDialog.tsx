import * as React from 'react';
import { View } from 'react-native';
import { Button, Dialog, Portal, PaperProvider, Text } from 'react-native-paper';

const CustomDialog = ({visible, body, completeText, cancelPress, completeButton}) => {
  return (
    <View>
        <Portal>
            <Dialog visible={visible} onDismiss={cancelPress}>
            <Dialog.Title>Alert</Dialog.Title>
            <Dialog.Content>
                <Text variant="bodyMedium">{body}</Text>
            </Dialog.Content>
            <Dialog.Actions>
                <Button onPress={cancelPress}>Cancel</Button>
                <Button onPress={completeButton}>{completeText}</Button>
            </Dialog.Actions>
            </Dialog>
        </Portal>
    </View>
  );
};

export default CustomDialog;