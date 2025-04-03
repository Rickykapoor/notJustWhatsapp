import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { Slot, Stack } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Ionicons } from '@expo/vector-icons'
import { OverlayProvider, Chat, Theme, DeepPartial,  } from 'stream-chat-expo'
import { StreamChat } from 'stream-chat'
import { ChatProvider } from '@/providers/ChatProvider'

const SecureLayout = () => {
  
  return (

      <ChatProvider>
        <Stack>
          <Stack.Screen name='users' options={{
            headerShown: true,
            headerTitle: 'Users',
            headerStyle: {
              backgroundColor: '#1E0C47',
            },
            
            headerTitleStyle: {
              color: 'white',
            },
            headerTintColor: 'white',
          }}/>
          <Stack.Screen name='(tabs)' options={{
            headerShown: false,
          
          }}/>
          
        </Stack>
        </ChatProvider>
  )
}

export default SecureLayout