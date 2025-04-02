import { supabase } from "@/lib/supabase"
import { User } from "@supabase/supabase-js"
import { Session } from "@supabase/supabase-js"
import React, { PropsWithChildren, useState } from "react"
import { router } from "expo-router"


type AuthContextType = {
    session: Session | null
    User: User | null | undefined
    profile: any | null
}

const AuthContext = React.createContext<AuthContextType>({
    session: null,
    User: null,
    profile: null
})

export const AuthProvider = ({ children }: PropsWithChildren ) => {
    const [session, setSession] = useState<Session | null>(null)
    const [User, setUser] = useState<User | null | undefined>(null)
    const [profile, setProfile] = useState<any | null>(null)
    

    // Fetch profile when session changes
    React.useEffect(()=>{
        console.log('Session user changed:', session?.user?.email)
        if(!session?.user){
          setProfile(null)
          return
        }
        const fetchProfile = async () => {
          let { data, error } = await supabase
            .from('profiles')
            .select("*")
            .eq('id', session.user?.id)
            .single()
          if(error) {
            console.log('Error fetching profile:', error.message)
          } else {
            console.log('Profile loaded:', data)
            setProfile(data)
          }
        }
        fetchProfile()
      },[session?.user])


    
      // Set up auth listeners
      React.useEffect(() => {
        console.log('Setting up auth listeners...')
        supabase.auth.getSession().then(({ data: { session } }) => {
          console.log('Initial session:', session?.user?.email)
          setSession(session)
        })
      
        supabase.auth.onAuthStateChange((_event, session) => {
          console.log('Auth state changed:', _event, session?.user?.email)
          if (session?.user) {
            router.replace('/home') // Redirect to home if logged in
          } else {
            router.replace('/(auth)/SignIn') // Redirect to auth screen if logged out
          }
          setSession(session)
        })
      }, [])        

    
    
        // Listen for session changes
       
      
      return (
        <AuthContext.Provider value={{session, User: session?.user, profile}}>
          {children}
        </AuthContext.Provider>
      )
      
    
}
export const useAuth = () => React.useContext(AuthContext)
