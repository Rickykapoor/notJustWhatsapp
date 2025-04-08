import React, { PropsWithChildren, useEffect, useState } from "react";
import { StreamChat, Channel as StreamChannel } from "stream-chat";
import {
  OverlayProvider,
  Theme,
  DeepPartial,
  Chat,
} from "stream-chat-expo";
import { useAuth } from "./AuthProvider";

// ✅ Init StreamChat instance once
const client = StreamChat.getInstance(
  process.env.EXPO_PUBLIC_STREAM_API_KEY!
);

// ✅ Context definition
interface ChatContextType {
  client: StreamChat;
  isReady: boolean;
  activeChannel: StreamChannel | null;
  setActiveChannel: (channel: StreamChannel) => void;
}

const ChatContext = React.createContext<ChatContextType>({
  client,
  isReady: false,
  activeChannel: null,
  setActiveChannel: () => {},
});

export const ChatProvider = ({ children }: PropsWithChildren) => {
  const [isReady, setIsReady] = useState(false);
  const [activeChannel, setActiveChannel] = useState<StreamChannel | null>(null);
  const { profile } = useAuth();

  const theme: DeepPartial<Theme> = {
    channelListMessenger: {
      flatList: { backgroundColor: "transparent" },
      flatListContent: { backgroundColor: "transparent" },
    },
    messageList: {
      messageContainer: { backgroundColor: "transparent" },
    },
  };

  useEffect(() => {
    const connect = async () => {
      if (!profile?.id) return;

      try {
        if (client.userID) return; // ✅ avoid reconnecting

        await client.connectUser(
          {
            id: profile.id,
            name: profile.fullname || profile.email,
            image: profile.avatar_url || "https://i.imgur.com/fR9Jz14.png",
          },
          client.devToken(profile.id)
        );

        setIsReady(true);
        console.log("✅ Stream connected");
      } catch (error) {
        console.error("❌ Stream connectUser error:", error);
      }
    };

    connect();

    return () => {
      if (client.userID) {
        client.disconnectUser();
        setIsReady(false);
      }
    };
  }, [profile?.id]);

  return (
    <ChatContext.Provider value={{ client, isReady, activeChannel, setActiveChannel }}>
      <OverlayProvider value={{ style: theme }}>
      {isReady ? <Chat client={client}>{children}</Chat> : null}
      </OverlayProvider>
    </ChatContext.Provider>
  );
};

export const useChatContext = () => React.useContext(ChatContext);
