import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';

const ProfileScreen = () => {
  const { profile } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/(auth)/SignIn');
  };

  return (
    <LinearGradient colors={['#10002B', '#240046', '#3C096C', '#5A189A']} 
      locations={[0.2, 0.5, 0.8, 1]}  
      start={{ x: 0.5, y: 0 }} 
      end={{ x: 0.5, y: 1 }} 
      style={{flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20}}
    >
      {/* Profile Picture */}
      <Image 
        source={{ uri: profile?.avatar_url || 'https://www.pngitem.com/pimgs/m/140-1403945_transparent-avatar-png-good-avatar-pictures-for-users.png' }} 
        className='w-28 h-28 rounded-full border-4 border-purple-500' 
      />

      {/* User Name */}
      <Text className='text-white text-2xl font-bold mt-4'>{profile?.fullname || 'Unknown User'}</Text>
      <Text className='text-gray-300 text-lg mt-1'>{profile?.email}</Text>

      {/* Update Details Button */}
      <TouchableOpacity 
        className='bg-purple-600 py-3 px-6 rounded-full mt-6 flex-row items-center'
        onPress={() => router.push('/update-profile')}
      >
        <AntDesign name='edit' size={20} color='white' className='mr-2' />
        <Text className='text-white text-lg font-semibold'>Update Profile</Text>
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity 
        className='bg-red-500 py-3 px-6 rounded-full mt-4 flex-row items-center'
        onPress={handleLogout}
      >
        <AntDesign name='logout' size={20} color='white' className='mr-2' />
        <Text className='text-white text-lg font-semibold'>Logout</Text>
      </TouchableOpacity>

    </LinearGradient>
  );
};

export default ProfileScreen;
