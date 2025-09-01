import { Tabs } from 'expo-router'
import { Home, MessageCircle, Settings, LibraryBig } from '@tamagui/lucide-icons'

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#fff', borderTopWidth: 0 },
        tabBarActiveTintColor: '#0E0E55', // our primary
        tabBarInactiveTintColor: '#808080',
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <Home
              color={focused ? '#0E0E55' : '#808080'}
              
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ focused }) => (
            <MessageCircle  color={focused ? '#0E0E55' : '#808080'}
               />
          ),
        }}
      />
      <Tabs.Screen
        name="resources"
        options={{
          title: 'Resources',
          tabBarIcon: ({ focused}) => (<LibraryBig color={focused ? '#0E0E55' : '#808080'}
              />),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({focused}) =>( <Settings color={focused ? '#0E0E55' : '#808080'}
             />),
        }}
      />
    </Tabs>
  )
}
