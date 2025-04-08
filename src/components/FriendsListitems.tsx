import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { useChatContext } from '@/providers/ChatProvider';
import AntDesign from '@expo/vector-icons/AntDesign';
import { supabase } from '@/lib/supabase';

const FriendsListItems = ({
  user,
  refreshList,
}: {
  user: any | null;
  refreshList: () => void;
}) => {
  const { client: chatClient, setActiveChannel, isReady } = useChatContext();
  const { User } = useAuth();
  const [loading, setLoading] = useState(false);
  console.log("🔑 Profile ID:", user?.id);
  console.log("🔐 DevToken:", chatClient.devToken(user?.id));
  
  const onPress = async () => {
    try {
      if (!isReady || !chatClient || !User?.id || !user?.id) {
        Alert.alert("Chat Error", "Chat is not ready yet.");
        return;
      }
  
      const membersShort = [User.id.slice(0, 8), user.id.slice(0, 8)].sort();
      const channelId = `chat-${membersShort.join("-")}`;
      const members = [User.id, user.id];
  
      const channel = chatClient.channel("messaging", channelId, {
        members,
      });
  
      await channel.watch();
      setActiveChannel(channel);
      router.push(`/(app)/channel/${channel.id}`);
    } catch (error) {
      console.error("❌ Error opening chat:", error);
      Alert.alert("Error", "Could not open chat.");
    }
  };
  
  
  
  

  const removeFriend = async () => {
    Alert.alert(
      'Remove Friend',
      `Are you sure you want to remove ${user?.fullname}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);

            const { error } = await supabase
              .from('friendships')
              .delete()
              .or(`sender_id.eq.${User?.id},receiver_id.eq.${User?.id}`)
              .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
              .eq('status', 'accepted');

            if (error) {
              Alert.alert('Error', 'Failed to remove friend. Please try again.');
              console.error('❌ Error removing friend:', error.message);
            } else {
              refreshList();
              Alert.alert('Success', 'Friend removed successfully.');
            }

            setLoading(false);
          },
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      className="flex-row items-center bg-white/10 p-4 my-2 mx-2 rounded-xl border border-purple-700 shadow-lg shadow-purple-400"
      onPress={isReady ? onPress : undefined}
      disabled={!isReady || loading}
    >
      <Image
        source={{
          uri:
            user.avatar_url ||
            'https://www.pngitem.com/pimgs/m/140-1403945_transparent-avatar-png-good-avatar-pictures-for-users.png',
        }}
        className="w-12 h-12 rounded-full border-2 border-purple-500"
      />

      <View className="flex-1 ml-4">
        <Text className="text-lg font-bold text-white">{user?.fullname}</Text>
        <Text className="text-sm text-pink-300">{user?.email}</Text>
      </View>

      <TouchableOpacity
        onPress={removeFriend}
        className="mr-2 p-2 bg-red-500 rounded-lg"
        disabled={loading}
      >
        <AntDesign name="deleteuser" size={24} color="white" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default FriendsListItems;
