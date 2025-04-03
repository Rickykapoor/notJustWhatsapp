import React, { PropsWithChildren, useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { OverlayProvider, Theme, DeepPartial } from "stream-chat-expo";
import { Chat } from "stream-chat-expo";
import { useAuth } from "./AuthProvider";

const client = StreamChat.getInstance(process.env.EXPO_PUBLIC_STREAM_API_KEY);

const ChatContext = React.createContext<{
    [x: string]: any;
    client: StreamChat | null;
    isReady: boolean;
  }>({
    client: null,
    isReady: false,
  });


export const ChatProvider = ({ children }: PropsWithChildren) => {
    const [isReady, setIsReady] = useState(false)
    
    const theme: DeepPartial<Theme> = {
        channelListMessenger: {
          flatList: {
            backgroundColor: 'transparent', // This styles the FlatList component itself
          },
          flatListContent: {
            backgroundColor: 'transparent', // This styles the content container of the FlatList
          },
          
        },
        messageList: {
          
          messageContainer: {
            backgroundColor: 'transparent',
          },
          
          
          
    
        },
        messageInput: {
         
        },
        
      };

    const {profile} = useAuth()

  useEffect(() => {

    if(!profile) return
        const connect = async () => {
          await client.connectUser(
          {
            id: profile?.id,
            name: profile?.fullname,
            image: 'https://i.imgur.com/fR9Jz14.png',
          },
          client.devToken(profile?.id)
        );
        setIsReady(true)
        // const channel = client.channel("messaging", "the_park", {
        //   name: "The Park",
        // });
        // await channel.watch()
        }
        connect();
        return () => {
        if(isReady) {   
            client.disconnectUser()
        }
        setIsReady(false)
        }
    },[profile?.id])

  return (
    <>
    <ChatContext.Provider value={{ client, isReady }}>
    <OverlayProvider value={{ style: theme}}>
        <Chat client={client}>
            {children}
        </Chat>
    </OverlayProvider>
    </ChatContext.Provider>
    </>
  );
};

export const useChatContext = () => React.useContext(ChatContext)