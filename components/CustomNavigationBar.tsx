import { Appbar, Switch, useTheme } from 'react-native-paper';
import { getHeaderTitle } from '@react-navigation/elements'
import CustomMenu from './CustomMenu';
import { PreferencesContext } from '../lib/preference';
import { useContext } from 'react';

export default function CustomNavigationBar({navigation, route, options, back, hasCustomMenu, menuItems}) {
    const title = getHeaderTitle(options, route.name);
    const theme = useTheme();
    const { toggleTheme, isThemeDark } = useContext(PreferencesContext);
    
    return (
        <Appbar.Header>
            {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
            <Appbar.Content title={title}/>
            <Switch
                color={'red'}
                value={isThemeDark}
                onValueChange={toggleTheme}
            />
            {!back ? <CustomMenu /> : null}
            {hasCustomMenu && back ? <CustomMenu menuItems={menuItems}/> : null}
        </Appbar.Header>
    );
}