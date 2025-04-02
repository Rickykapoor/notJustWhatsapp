import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';

const RequestListItems = ({ item, refreshList }: { item: any; refreshList: () => void }) => {
  const { User } = useAuth();
  const [loading, setLoading] = useState(false);

  const acceptRequest = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("friendships")
      .update({ status: "accepted" })
      .eq("sender_id", item.user.id)
      .eq("receiver_id", User?.id);

    if (error) {
      Alert.alert("Error", "Failed to accept friend request. Try again.");
      console.error("Error accepting request:", error.message);
    } else {
      refreshList();
      Alert.alert("Success", "Friend request accepted.");
    }
    setLoading(false);
  };

  const rejectRequest = async () => {
    Alert.alert(
      "Reject Friend Request",
      `Are you sure you want to reject the request from ${item?.user?.fullname}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            const { error } = await supabase
              .from("friendships")
              .update({ status: "rejected" })
              .eq("sender_id", item.user.id)
              .eq("receiver_id", User?.id);

            if (error) {
              Alert.alert("Error", "Failed to reject friend request.");
              console.error("Error rejecting request:", error.message);
            } else {
              refreshList();
              Alert.alert("Success", "Friend request rejected.");
            }
            setLoading(false);
          },
        },
      ]
    );
  };

  return (
    <View className="flex-row items-center bg-white/10 p-4 my-2 mx-2 rounded-xl border border-purple-700 shadow-lg shadow-purple-400">
      <View className="flex-1 justify-center items-center ml-4">
        <Image
          source={{
            uri: item.avatar_url || 'https://www.pngitem.com/pimgs/m/140-1403945_transparent-avatar-png-good-avatar-pictures-for-users.png',
          }}
          className="w-16 h-16 rounded-full border-2 border-purple-500"
        />
        <Text className="text-xl font-bold text-white">{item?.user?.fullname}</Text>
        <Text className="text-sm text-pink-300">{item?.user?.email}</Text>
      </View>

      <View className="flex space-x-4">
        <TouchableOpacity 
          onPress={acceptRequest} 
          className="flex-row items-center space-x-2 mb-5 p-2 bg-green-600 rounded-lg"
          disabled={loading}
        >
          <AntDesign name="check" size={20} color="white" />
          <Text className="text-sm text-white">Accept</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={rejectRequest} 
          className="flex-row items-center space-x-2 p-2 bg-red-600 rounded-lg"
          disabled={loading}
        >
          <AntDesign name="close" size={20} color="white" />
          <Text className="text-sm text-white">Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RequestListItems;

