import { Appbar } from 'react-native-paper';
import { getHeaderTitle } from '@react-navigation/elements'
import CustomMenu from './CustomMenu';

export default function CustomNavigationBar({navigation, route, options, back, hasCustomMenu, menuItems}) {
    const title = getHeaderTitle(options, route.name);

    return (
        <Appbar.Header>
            {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
            <Appbar.Content title={title}/>
            {!back ? <CustomMenu /> : null}
            {hasCustomMenu && back ? <CustomMenu menuItems={menuItems}/> : null}
        </Appbar.Header>
    );
}