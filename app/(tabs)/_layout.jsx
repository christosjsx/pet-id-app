import { View, Text, Image, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { icons } from '../../constants';
import { Ionicons } from '@expo/vector-icons';

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View style={styles.tabItem}>
      <Image
        source={icon}
        style={[styles.icon, { tintColor: color }]}
        resizeMode="contain"
      />
      <Text
        style={[
          styles.label,
          {
            color: color,
            fontFamily: focused ? 'Poppins-SemiBold' : 'Poppins-Regular',
          },
        ]}
      >
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#00C5CB',   // your active color
        tabBarInactiveTintColor: '#005b96', // your inactive color
        tabBarStyle: {
        backgroundColor: '#011f4b',
        borderTopWidth: 0,
        borderTopColor: '#011f4b',  // to visually debug the tab bar border
        height: 95,
        paddingTop: 20,
        paddingBottom: 10,
      },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={icons.home} color={color} name="Home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={icons.bookmark} color={color} name="Events" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="pets"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={icons.paw} color={color} name="Pets" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={icons.profile} color={color} name="Profile" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
  },
  icon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  label: {
    fontSize: 10,
    textAlign: 'center',
  },
});

export default TabsLayout;