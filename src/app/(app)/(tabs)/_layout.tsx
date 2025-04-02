import { View, Text, Image } from 'react-native'
import React from 'react'
import { Link, Tabs } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MessageCircle } from 'lucide-react-native';


const TabsLayout = () => {
  return (
    
    <Tabs screenOptions={{
      tabBarActiveTintColor: 'white',
      tabBarInactiveTintColor: 'gray',
      headerStyle: {
        backgroundColor: '#10002B',
        height: 90,
      },
      tabBarStyle: {
        height:75,
        
        backgroundColor: '#10002B',
      },
    }}>
      <Tabs.Screen name='home' options={{
        title: 'Home',
        headerTitle: 'notJustWhatsApp',
        headerTitleStyle: {
          color: 'white',
          fontSize: 18,
          
          textAlign: 'center',
          fontWeight: 'bold',
          fontFamily: 'Poppins-Bold',
          
          width: '100%',
          

        },
        tabBarIcon: ({color, size}) => (
          <>
            <Entypo name='home' color={color} size={35} />
            
          </>
        ),
       
        headerRight: () => (
          <View className="mr-4">
            <Link asChild href='/(app)/users/notification'>
              <Ionicons name="people" size={35} color="white" />
            </Link>
          </View>
        ),
        headerLeft: () => (
          <View className="ml-4 w-[35px] h-[35px] bg-white rounded-full">
            <Link asChild href='/(app)/users'>
              <Image source={{uri: 'https://cdn.dribbble.com/users/23110649/avatars/normal/data?1739399421'}} className='w-full h-full rounded-full' />
            </Link>
          </View>
        )
      }} />
      <Tabs.Screen name='status' options={{
        title: 'Status',
        headerTitle: 'Status',
        headerTitleStyle: {
          color: 'white',
          fontSize: 18,
          fontWeight: 'bold',
          fontFamily: 'Poppins-Bold',
          width: '100%',
          
        },
        tabBarIcon: ({color, size}) => (
          <MessageCircle size={size} color={color} />
        )
      }} />
      
      <Tabs.Screen name='profile' options={{
        title: 'Profile',
        headerTitleStyle: {
          color: 'white',
          fontSize: 22,
          fontWeight: 'bold',
          fontFamily: 'Poppins-Bold',
          
          width: '100%',
          
          
        },
        
        tabBarIcon: ({color, size}) => (
          <AntDesign name="user" size={size} color={color} />
        )
      }} />
      
    </Tabs>
   
  )
}

export default TabsLayout