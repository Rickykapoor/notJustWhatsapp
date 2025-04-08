import { View, Text, Image, TouchableOpacity, Alert, ActivityIndicator, StatusBar } from 'react-native';
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import 'react-native-url-polyfill/auto';

const ProfileScreen = () => {
  const { profile, session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/(auth)/SignIn');
  };

  const uploadAvatar = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Camera roll permission is required.');
        return;
      }
  
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        allowsEditing: true,
      });
  
      if (result.canceled || !result.assets?.length) return;
  
      setLoading(true);
      const file = result.assets[0];
      const fileExt = file.uri.split('.').pop();
      const fileName = `${profile.id}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
  
      // ✅ SAFELY convert image to blob using fetch
      const response = await fetch(file.uri);
      const blob = await response.blob();
  
      // Upload to Supabase
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, blob, {
          upsert: true,
          contentType: 'image/jpeg', // or 'image/png'
        });
  
      if (uploadError) throw uploadError;
  
      const {
        data: { publicUrl },
      } = supabase.storage.from('avatars').getPublicUrl(filePath);
  
      // Update avatar_url in profiles table
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', session.user.id);
  
      if (updateError) throw updateError;
  
      setAvatarUrl(publicUrl + `?t=${Date.now()}`); // bust cache
      Alert.alert('Success', 'Avatar updated!');
    } catch (error: any) {
      console.error('Error uploading avatar:', error.message);
      Alert.alert('Upload failed', error.message || 'Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <LinearGradient
      colors={['#10002B', '#240046', '#3C096C', '#5A189A']}
      locations={[0.2, 0.5, 0.8, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 }}
    >
      <StatusBar  backgroundColor="#10002B" />
      <TouchableOpacity onPress={uploadAvatar}>
        <Image
          source={{
            uri:
              avatarUrl ||
              'https://www.pngitem.com/pimgs/m/140-1403945_transparent-avatar-png-good-avatar-pictures-for-users.png',
          }}
          className="w-28 h-28 rounded-full border-4 border-purple-500"
        />
        {loading && (
          <View className="absolute w-28 h-28 items-center justify-center bg-black/50 rounded-full">
            <ActivityIndicator color="#fff" />
          </View>
        )}
      </TouchableOpacity>

      <Text className="text-white text-2xl font-bold mt-4">{profile?.fullname || 'Unknown User'}</Text>
      <Text className="text-gray-300 text-lg mt-1">{profile?.email}</Text>

      <TouchableOpacity
        className="bg-purple-600 py-3 px-6 rounded-full mt-6 flex-row items-center"
        onPress={() => router.push('/update-profile')}
      >
        <AntDesign name="edit" size={20} color="white" />
        <Text className="text-white text-lg font-semibold ml-2">Update Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-red-500 py-3 px-6 rounded-full mt-4 flex-row items-center"
        onPress={handleLogout}
      >
        <AntDesign name="logout" size={20} color="white" />
        <Text className="text-white text-lg font-semibold ml-2">Logout</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default ProfileScreen;
