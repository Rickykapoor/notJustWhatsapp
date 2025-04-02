import { View, Text, FlatList, RefreshControl } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import RequestListItems from '@/components/RequestListItems';
import OutgoingListItems from '@/components/OutgoingListItems';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useFocusEffect } from '@react-navigation/native';

const Notifications = () => {
    const { User } = useAuth();
    const [incomingRequests, setIncomingRequests] = useState<any[]>([]);
    const [outgoingRequests, setOutgoingRequests] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchRequests = async () => {
        try {
            setRefreshing(true);
            const { data: incoming, error: incomingError } = await supabase
                .from("friendships")
                .select("*")
                .eq("receiver_id", User?.id)
                .eq("status", "pending");

            if (incomingError) throw incomingError;

            const senderIds = incoming.map((req) => req.sender_id);
            let incomingUsers = [];

            if (senderIds.length > 0) {
                const { data: users, error: usersError } = await supabase
                    .from("profiles")
                    .select("id, fullname, email")
                    .in("id", senderIds);

                if (usersError) throw usersError;
                incomingUsers = users;
            }

            setIncomingRequests(
                incoming.map((req) => ({
                    ...req,
                    user: incomingUsers.find((u) => u.id === req.sender_id),
                }))
            );

            // ✅ Fetch Outgoing Requests
            const { data: outgoing, error: outgoingError } = await supabase
                .from("friendships")
                .select("*")
                .eq("sender_id", User?.id)
                .eq("status", "pending");

            if (outgoingError) throw outgoingError;

            const receiverIds = outgoing.map((req) => req.receiver_id);
            let outgoingUsers = [];

            if (receiverIds.length > 0) {
                const { data: users, error: usersError } = await supabase
                    .from("profiles")
                    .select("id, fullname, email")
                    .in("id", receiverIds);

                if (usersError) throw usersError;
                outgoingUsers = users;
            }

            setOutgoingRequests(
                outgoing.map((req) => ({
                    ...req,
                    user: outgoingUsers.find((u) => u.id === req.receiver_id),
                }))
            );
        } catch (error) {
            console.error("❌ Error fetching friend requests:", error);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchRequests();

        // 🔄 Real-time Subscription for Friendships
        const subscription = supabase
            .channel("friend_request_updates")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "friendships" },
                () => {
                    console.log("🔄 Friend request table updated! Refreshing...");
                    fetchRequests();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    // 🔄 Refresh on Tab Switch
    useFocusEffect(
        useCallback(() => {
            fetchRequests();
        }, [])
    );

    return (
        <LinearGradient
            colors={["#10002B", "#240046", "#3C096C", "#5A189A"]}
            locations={[0.2, 0.5, 0.8, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={{ flex: 1, padding: 10 }}
        >
            <Text className="text-2xl font-bold text-white mb-3 text-center">
                Notifications
            </Text>

            {/* Incoming Requests */}
            <Text className="text-xl font-bold text-white mb-3">Incoming Requests</Text>
            {incomingRequests.length === 0 ? (
                <View className="flex items-center justify-center py-10">
                    <FontAwesome6 name="user-clock" size={40} color="white" />
                    <Text className="text-lg text-gray-300 mt-2">No incoming requests</Text>
                </View>
            ) : (
                <FlatList
                    data={incomingRequests}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <RequestListItems item={item} refreshList={fetchRequests} />
                    )}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchRequests} />}
                />
            )}

            {/* Outgoing Requests */}
            <Text className="text-xl font-bold text-white mt-5 mb-3">Outgoing Requests</Text>
            {outgoingRequests.length === 0 ? (
                <View className="flex items-center justify-center py-10">
                    <FontAwesome6 name="user-plus" size={40} color="white" />
                    <Text className="text-lg text-gray-300 mt-2">No outgoing requests</Text>
                </View>
            ) : (
                <FlatList
                    data={outgoingRequests}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <OutgoingListItems item={item} refreshList={fetchRequests} />
                    )}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchRequests} />}
                />
            )}
        </LinearGradient>
    );
};

export default Notifications;
