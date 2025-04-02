import { View, Text, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/lib/supabase';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const UserListItems = ({ user, refreshList }: { user: any; refreshList: () => void }) => {
  const { User } = useAuth();
  const [loading, setLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const sendFriendRequest = async () => {
    const senderId = User.id;
    const receiverId = user.id;

    try {
        // ✅ Check if a friend request already exists in either direction
        const { data: existingRequests, error: checkError } = await supabase
            .from("friendships")
            .select("*")
            .or(`and(sender_id.eq.${senderId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${senderId})`);

        if (checkError) {
            console.error("Error checking request:", checkError);
            return { success: false, error: checkError };
        }

        if (existingRequests.length > 0) {
            const existingRequest = existingRequests[0];
            if (existingRequest.status === "pending") {
                return { success: false, message: "Friend request already sent!" };
            }
            if (existingRequest.status === "accepted") {
                return { success: false, message: "You are already friends!" };
            }
        }

        // ✅ If no request exists, send a new friend request
        const { error: insertError } = await supabase
            .from("friendships")
            .insert([{ sender_id: senderId, receiver_id: receiverId, status: "pending" }]);

        if (insertError) {
            console.error("Error sending friend request:", insertError);
            return { success: false, error: insertError };
        }

        console.log("✅ Friend request sent!");
        refreshList(); // ✅ Refresh the list to reflect changes
        return { success: true, message: "Friend request sent!" };

    } catch (error) {
        console.error("Unexpected error sending request:", error);
        return { success: false, error };
    }
};


  return (
    <TouchableOpacity className="flex-row items-center bg-white/10 p-4 my-2 mx-2 rounded-xl border border-purple-700 shadow-lg shadow-purple-400">
      <Image
        source={{
          uri: user.avatar_url || 'https://www.pngitem.com/pimgs/m/140-1403945_transparent-avatar-png-good-avatar-pictures-for-users.png',
        }}
        className="w-16 h-16 rounded-full border-2 border-purple-500"
      />
      <View className="flex-1 ml-4">
        <Text className="text-xl font-bold text-white">{user.fullname}</Text>
        <Text className="text-sm text-gray-300">{user.email}</Text>
      </View>

      {/* ✅ Fixed TouchableOpacity & Icon Visibility */}
      <TouchableOpacity
        onPress={sendFriendRequest}
        disabled={loading || requestSent}
        className="p-2 rounded-full bg-purple-600"
        style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}
      >
        {loading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <FontAwesome6 name="user-plus" size={20} color="white" />
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default UserListItems;


