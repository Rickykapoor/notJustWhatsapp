import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'
const UsersLayout = () => {
  return (
    <Tabs screenOptions={{
        headerShown: false,
        tabBarStyle: {
            backgroundColor: '#1E0C47',
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: 'bold',
        },
    }}>
        <Tabs.Screen name='notification' options={{
            title: 'Notification',
            tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="notifications" color={color} size={size} />
            ),
        }} />
        <Tabs.Screen name='friends' options={{
            title: 'Friends',
            tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="person" color={color} size={size} />
            ),
        }} />
        <Tabs.Screen name='users' options={{
            title: 'Users',
            tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="person" color={color} size={size} />
            ),
        }} />
        
    </Tabs>
  )
}

export default UsersLayout