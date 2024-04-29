import { createDrawerNavigator } from '@react-navigation/drawer';
import About from '../app/about';

const Drawer = createDrawerNavigator();

export default function MyDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="about" component={About} />
    </Drawer.Navigator>
  );
}