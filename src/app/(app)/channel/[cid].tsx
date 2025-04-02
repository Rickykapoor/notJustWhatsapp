import { View, Text, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { MessageInput } from 'stream-chat-expo'
import { MessageList } from 'stream-chat-expo'
    import { Channel } from 'stream-chat-expo'
import { useLocalSearchParams } from 'expo-router'
import { Channel as Channeltype } from 'stream-chat'
import { useChatContext } from 'stream-chat-expo'
const index = () => {
        const {cid} = useLocalSearchParams();   
    const [channel, setChannel] = useState< Channeltype | null>(null);
    
    const {client} = useChatContext();
    useEffect(()=>{
        const fetchChannel = async () => {
            const channels = await client.queryChannels({cid: cid as string});
            setChannel(channels[0]);
        }
        fetchChannel();
    },[])
    if(!channel){
        return(
            <View className='flex-1 justify-center items-center'>
                <ActivityIndicator/>
            </View>
        )
    }
    return(
        <Channel channel={channel}>
          <MessageList/>
          <MessageInput/>
        </Channel>
      ) 
}

export default index