import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import { supabase } from '@/lib/supabase';

const OutgoingListItems = ({ item, refreshList }: { item: any; refreshList: () => void }) => {
  
  const cancelRequest = async () => {
    try {
      const { error } = await supabase
        .from("friendships")
        .delete()
        .eq("sender_id", item.sender_id)
        .eq("receiver_id", item.receiver_id)
        .eq("status", "pending");

      if (error) throw error;

      console.log("Friend request canceled!");
      refreshList();
    } catch (error) {
      console.error("Error canceling friend request:", error);
    }
  };

  return (
    <View className="flex-row items-center bg-white/10 p-4 my-2 mx-2 rounded-xl border border-purple-700 shadow-lg shadow-purple-400">
      <Image
        source={{
          uri: item.avatar_url || 'https://www.pngitem.com/pimgs/m/140-1403945_transparent-avatar-png-good-avatar-pictures-for-users.png',
        }}
        className="w-16 h-16 rounded-full border-2 border-purple-500"
      />
      <View className="flex-1 ml-4">
        <Text className="text-xl font-bold text-white">{item?.user?.fullname}</Text>
        <Text className="text-sm text-pink-300">{item?.user?.email}</Text>
      </View>
      <TouchableOpacity onPress={cancelRequest} className="p-2">
        <AntDesign name="closecircle" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );
};

export default OutgoingListItems;

