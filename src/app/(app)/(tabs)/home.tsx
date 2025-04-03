import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from 'expo-status-bar';  
import { FontAwesome } from "@expo/vector-icons";
import { Channel, ChannelList , DefaultStreamChatGenerics, MessageList, MessageInput } from 'stream-chat-expo';
import { router } from 'expo-router';
import { useChatContext } from 'stream-chat-expo';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/lib/supabase';

const channel = useChatContext
function dayjs(created_at: any) {
  throw new Error('Function not implemented.');
}

const CustomChannelPreview =  ({ channel, setActiveChannel }) => {
  const { messages } = channel.state;
  const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
  const unreadCount = channel?.countUnread() || 0;

  const lastMessageTime = lastMessage?.created_at 
    ? new Date(lastMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : "No messages";
  const members = Object.values(channel?.state?.members || {});
  const otherUser = members.find(member => {
    return member && typeof member === 'object' && 'user' in member && 
           member.user && typeof member.user === 'object' && 'id' in member.user && 
           member.user.id !== channel._client.user.id;
  });
  
  // @ts-ignore
  const otherUserName = otherUser?.user?.name || channel.data?.name || "Unknown User";
  console.log(otherUserName);
  return (
    <TouchableOpacity 
      style={styles.channelContainer} 
      onPress={() => router.push(`/channel/${channel.cid}`)}
    >
      {/* Profile Picture */}
      <Image source={{ uri: channel.data.image || 'https://cdn.pixabay.com/photo/2015/12/01/20/28/road-1072823_1280.jpg' }} style={styles.avatar} />

      {/* Channel Details */}
      <View style={styles.details}>
        <Text style={styles.name}>{ otherUserName}</Text>
        {unreadCount > 0 ? (
        <Text style={styles.lastMessage} className='font-bold'>
          {lastMessage?.text || "Attachment..."}
        </Text>
        ):(
          <Text style={styles.lastMessage}>
            {lastMessage?.text || "No messages yet"}
          </Text>
        )}
      </View>

      {/* Timestamp & Read Status */}
      <View style={styles.info}>
        <Text style={styles.timestamp}>{lastMessageTime}</Text>
        {unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{unreadCount}</Text>
        </View>)}
      </View>
    </TouchableOpacity>
  );
};

const home = () => {
  const {profile} = useAuth()
 
  return (
    <LinearGradient   colors={["#10002B", "#240046", "#3C096C", "#5A189A"]} 
    locations={[0.2, 0.5, 0.8, 1]}  
    start={{ x: 0.5, y: 0 }} 
    end={{ x: 0.5, y: 1 }} style={{flex: 1}}>
      <StatusBar style='light' />
    <View className='flex-1 justify-start '>

    <Text className="text-white text-2xl font-extrabold ml-6 mt-6 tracking-wide">
  Connect & Chat with Friends ✨  
</Text>
<Text className="text-gray-300 text-lg ml-6 mt-2">
  Stay in touch with your loved ones anytime, anywhere.
</Text>


          <View className='flex-row justify items-center m-3'> 
          <View className=" flex-row items-center w-10/12 h-14 bg-white/10 pd-3 pl-3 rounded-full mt-4">
              <TextInput
                placeholder="Search"
                
                placeholderTextColor="#DDD"
                className="text-white flex-1 pl-3 text-lg h-full w-full"
              />
          
          </View>
          <View className='flex-row items-center justify-center bg-white/10 p-4 rounded-full mt-2 ml-3'>
            <FontAwesome name="search" size={18} color="white" />
          </View>
        </View>

   
      
      <View className='flex-1'>
        <ChannelList 
          filters={{ members: { $in: [profile?.id] } }}
          options={{}}
          sort={{}}
          Preview={(props) => <CustomChannelPreview {...props} setActiveChannel={() => {}} />}
          onSelect={(channel) => {
            router.push(`/channel/${channel.cid}`);
        }} 
       
        />
      </View>

    
  </View>
  </LinearGradient>

    
    
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D2B", // Deep dark background
    padding: 10,
  },
  channelContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A0B2E", // Dark purple card
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 15,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#5A189A", // Subtle neon border
    elevation: 5,
    shadowColor: "#9D5CFF", // Soft purple glow
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25, // Circular profile picture
    borderWidth: 1.5,
    borderColor: "#9D5CFF", // Purple glow around avatar
  },
  details: {
    flex: 1,
    marginLeft: 15,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff", // Soft lavender for readability
  },
  lastMessage: {
    fontSize: 14,
    color: "#9D5CFF", // Muted neon purple
  },
  info: {
    alignItems: "flex-end",
  },
  timestamp: {
    fontSize: 12,
    color: "#CDB4DB", // Soft pinkish-purple for a unique touch
  },
  unreadBadge: {
    width: 22,
    height: 22,
    backgroundColor: "#B39DDB", // Lilac background for the unread badge
    borderRadius: 11, // Circular shape
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
    shadowColor: "#B39DDB",
    shadowOpacity: 0.7,
    shadowRadius: 8,
  },
  unreadText: {
    color: "#FFF", // White text for better contrast
    fontSize: 12,
    fontWeight: "bold", // Bold text for clarity
  },
});

export default home


