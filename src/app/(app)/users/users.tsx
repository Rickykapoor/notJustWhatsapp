import { View, Text, FlatList, RefreshControl } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { LinearGradient } from 'expo-linear-gradient';
import UserListItems from '@/components/UserListItems'; // ✅ Import UserListItems component

const Users = () => {
    const { User } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchUsers = async () => {
        try {
            setRefreshing(true);

            // ✅ Fetch all users except the current user
            const { data, error } = await supabase
                .from("profiles")
                .select("id, fullname, email") // ✅ Fetch avatar_url
                .neq("id", User?.id);

            if (error) throw error;

            setUsers(data);
        } catch (error) {
            console.error("❌ Error fetching users:", error);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchUsers();

        // ✅ Supabase Real-time Subscription for Auto Refresh
        const subscription = supabase
            .channel('user_updates')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'profiles' },
                (payload) => {
                    console.log("🔄 User table updated:", payload);
                    fetchUsers();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    const onRefresh = useCallback(() => {
        fetchUsers();
    }, []);

    return (
        <LinearGradient colors={["#10002B", "#240046", "#3C096C", "#5A189A"]} style={{ flex: 1, padding: 10 }}>
            <Text className="text-2xl font-bold text-white mb-3 text-center">Users</Text>

            <FlatList
                data={users}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <UserListItems user={item} refreshList={fetchUsers} /> // ✅ Using UserListItems component
                )}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                contentContainerStyle={{ paddingBottom: 20 }} // ✅ Added spacing for better UI
            />
        </LinearGradient>
    );
};

export default Users;
