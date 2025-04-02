import { SafeAreaView } from "react-native";
import "../global.css";
import { Slot } from "expo-router";
import { AuthProvider } from "@/providers/AuthProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
      <Slot />
    </AuthProvider>
    </GestureHandlerRootView>
    
 

);
}
