import { View, Text, SafeAreaView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, AppState } from 'react-native'
import React from 'react'
import { Slot } from 'expo-router'
import { supabase } from '@/lib/supabase'
import { LinearGradient } from 'expo-linear-gradient'

const AuthLayout = () => {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh()
    } else {
      supabase.auth.stopAutoRefresh()
    }
  })
  return (
    
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      
        <SafeAreaView className="flex-1 bg-white">
        <KeyboardAvoidingView behavior="padding" className="flex-1">
            <Slot />
        </KeyboardAvoidingView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    
    
  )
}

export default AuthLayout