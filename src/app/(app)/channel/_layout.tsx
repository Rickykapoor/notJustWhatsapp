import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { router, Slot, Stack } from 'expo-router'
import { useAuth } from '@/providers/AuthProvider'

const ChatLayout = () => {
  const { session } = useAuth()
  useEffect(() => {
    if (!session) {
      router.replace('/(auth)/SignIn') // Redirect to auth screen if user logs out
    }
  }, [session])

  return (
    <Slot>
        
    </Slot>
  )
}

export default ChatLayout