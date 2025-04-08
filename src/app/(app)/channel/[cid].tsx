import { View, Text, ActivityIndicator } from 'react-native';
import React from 'react';
import { MessageInput, MessageList, Channel } from 'stream-chat-expo';
import { useChatContext } from '@/providers/ChatProvider'; // ✅ Use your custom provider

const ChannelScreen = () => {
  const { activeChannel, isReady } = useChatContext();

  if (!isReady || !activeChannel) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#9b59b6" />
        <Text className="text-white mt-4">Loading chat...</Text>
      </View>
    );
  }

  return (
    <Channel channel={activeChannel}>
      <MessageList />
      <MessageInput />
    </Channel>
  );
};

export default ChannelScreen;
