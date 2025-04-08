import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StatusBar } from 'react-native'
import LottieView from 'lottie-react-native';
import React, { useState } from 'react'
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import Fontisto from '@expo/vector-icons/Fontisto';
import { Link } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';

const SignIn = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })
    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  return (
    <LinearGradient
      colors={['#10002B', '#240046', '#3C096C', '#5A189A']}
      locations={[0.2, 0.5, 0.8, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#10002B" />

      <ScrollView>
        <View className="flex-1 items-center justify-start pt-10 px-10">
          <LottieView
            style={{ width: 250, height: 250 }}
            source={require('./../../assets/animations/signUp.json')}
            autoPlay
            loop
          />
          <Text className="text-4xl font-bold text-white">Sign In</Text>

          <View className="flex-row items-center gap-2 justify-center w-full h-14 pl-7 border-2 border-gray-400 rounded-xl mt-4">
            <Fontisto name="email" size={24} color="gray" />
            <TextInput
              placeholder="Email"
              placeholderTextColor="#aaa"
              className="w-full h-full px-4 py-2 text-white rounded-xl"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View className="flex-row items-center gap-2 justify-center w-full h-14 pl-7 border-2 border-gray-400 rounded-xl mt-4">
            <Ionicons name="lock-closed-outline" size={24} color="gray" />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#aaa"
              className="w-full h-full px-4 py-2 text-white rounded-xl"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            onPress={signInWithEmail}
            className="justify-center items-center w-150 h-14 px-10 py-2 bg-red-400 rounded-xl mt-7"
          >
            <Text className="text-white text-center text-xl font-bold">
              {loading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <Link href="/SignUp" className="text-center text-xl text-gray-300 mt-2">
            Don't have an account? <Text className="text-blue-400">Sign Up</Text>
          </Link>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default SignIn;
