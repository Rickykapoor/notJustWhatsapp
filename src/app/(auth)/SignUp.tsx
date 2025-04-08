import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    StatusBar,
    TouchableWithoutFeedback,
    Keyboard
  } from 'react-native';
  import LottieView from 'lottie-react-native';
  import React, { useState } from 'react';
  import AntDesign from '@expo/vector-icons/AntDesign';
  import Ionicons from '@expo/vector-icons/Ionicons';
  import Fontisto from '@expo/vector-icons/Fontisto';
  import { Link } from 'expo-router';
  import { supabase } from '@/lib/supabase';
  import { LinearGradient } from 'expo-linear-gradient';
  
  const SignUp = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
  
    async function signUpWithEmail() {
      if (password !== confirmPassword) {
        Alert.alert('Passwords do not match');
        return;
      }
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      if (error) {
        Alert.alert(error.message);
        setLoading(false);
      } else if (data?.user) {
        await updateProfile({
          id: data.user.id,
          fullname: name,
          phonenumber: phone,
          email: email,
          password: password,
        });
      }
    }
  
    async function updateProfile({
      id,
      fullname,
      phonenumber,
      email,
      password,
    }) {
      try {
        setLoading(true);
        const updates = {
          id,
          fullname,
          phonenumber,
          email,
          password,
          created_at: new Date(),
        };
  
        const { error } = await supabase.from('profiles').upsert(updates);
  
        if (error) throw error;
  
        console.log('Profile updated successfully');
      } catch (error) {
        Alert.alert(error.message);
      } finally {
        setLoading(false);
      }
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
  
        <ScrollView keyboardShouldPersistTaps="handled">
          <View className="flex-1 items-center justify-start pt-10 px-10">
            <LottieView
              style={{ width: 250, height: 250 }}
              source={require('./../../assets/animations/signUp.json')}
              autoPlay
              loop
            />
            <Text className="text-4xl font-bold text-white">Sign Up</Text>
  
            <View className="flex-row items-center gap-2 justify-center w-full h-14 pl-7 border-2 border-gray-400 rounded-xl mt-7">
              <AntDesign name="user" size={20} color="gray" />
              <TextInput
                placeholder="Name"
                placeholderTextColor="#aaa"
                className="w-full h-full px-4 py-2 text-white rounded-xl"
                value={name}
                onChangeText={setName}
              />
            </View>
  
            <View className="flex-row items-center gap-2 justify-center w-full h-14 pl-7 border-2 border-gray-400 rounded-xl mt-4">
              <Ionicons name="call-outline" size={24} color="gray" />
              <TextInput
                placeholder="Phone Number"
                placeholderTextColor="#aaa"
                className="w-full h-full px-4 py-2 text-white rounded-xl"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
  
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
  
            <View className="flex-row items-center gap-2 justify-center w-full h-14 pl-7 border-2 border-gray-400 rounded-xl mt-4">
              <Ionicons name="lock-closed-outline" size={24} color="gray" />
              <TextInput
                placeholder="Confirm Password"
                placeholderTextColor="#aaa"
                className="w-full h-full px-4 py-2 text-white rounded-xl"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>
  
            <TouchableOpacity
              onPress={signUpWithEmail}
              className="justify-center items-center w-150 h-14 px-10 py-2 bg-red-400 rounded-xl mt-7"
            >
              <Text className="text-white text-center text-xl font-bold">
                {loading ? 'Signing Up...' : 'Sign Up'}
              </Text>
            </TouchableOpacity>
  
            <Link href="/SignIn" className="text-center text-xl text-gray-300 mt-2">
              Already have an account? <Text className="text-blue-400">Sign In</Text>
            </Link>
          </View>
        </ScrollView>
      </LinearGradient>
    );
  };
  
  export default SignUp;
  