import { View, Text, StatusBar } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'

const status = () => {
  return (
    <LinearGradient   colors={["#10002B", "#240046", "#3C096C", "#5A189A"]} 
    locations={[0.2, 0.5, 0.8, 1]}  
    start={{ x: 0.5, y: 0 }} 
    end={{ x: 0.5, y: 1 }} style={{flex: 1}}>
      
    <View className='flex-1 justify-center items-center'>
      <Text className='text-white text-2xl font-bold'>Comming Soon</Text>
    </View>
    </LinearGradient>
  )
}

export default status