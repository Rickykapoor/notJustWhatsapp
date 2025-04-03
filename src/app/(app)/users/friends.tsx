import { View, Text, FlatList, RefreshControl } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FriendsListItems from '@/components/FriendsListitems';
import { useFocusEffect } from '@react-navigation/native';

const Friends = () => {
    const { User } = useAuth();
    const [friends, setFriends] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchFriends = async () => {
        try {
            setRefreshing(true);
            const { data: friendships, error } = await supabase
                .from("friendships")
                .select("*")
                .or(`sender_id.eq.${User?.id},receiver_id.eq.${User?.id}`)
                .eq("status", "accepted");

            if (error) throw error;

            const friendIds = friendships.map(req =>
                req.sender_id === User?.id ? req.receiver_id : req.sender_id
            );

            let friendsData = [];
            if (friendIds.length > 0) {
                const { data: users, error: usersError } = await supabase
                    .from("profiles")
                    .select("id, fullname, email")
                    .in("id", friendIds);

                if (usersError) throw usersError;
                friendsData = users;
            }

            setFriends(friendsData);
        } catch (error) {
            console.error("❌ Error fetching friends:", error);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchFriends();

        // 🔄 Real-time Subscription for Friendships
        const subscription = supabase
            .channel('friendship_updates')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'friendships' },
                () => {
                    console.log("🔄 Friend list updated! Refreshing...");
                    fetchFriends();
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
            fetchFriends();
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
                Friends
            </Text>

            {friends.length === 0 ? (
                <View className="flex items-center justify-center py-10">
                    <FontAwesome6 name="user-friends" size={40} color="white" />
                    <Text className="text-lg text-gray-300 mt-2">
                        No friends yet
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={friends}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ gap: 5 }}
                    renderItem={({ item }) => (
                        <FriendsListItems user={item} refreshList={fetchFriends} />
                    )}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchFriends} />}
                />
            )}
        </LinearGradient>
    );
};

export default Friends;
