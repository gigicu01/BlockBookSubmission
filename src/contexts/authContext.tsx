import { AuthSession, User } from "@supabase/supabase-js";
import React, { useContext, useEffect, useState } from "react";
import { supabaseClient } from "../api/supabaseClient";

export type AuthContext = {
    user: User | null
}

const AuthContext = React.createContext<AuthContext>({ user: null});
// This is the function that monitors whether the user is signed in or has signed out and acts accordignly to change the session.
// When the user signs is, it sets the user info in the session to the info of the user that signs in.
// WHen the user signs out, it clears the information in the session.
export const AuthProvider:React.FC<{}> = ({ children }) => {
    const [user, setUser] = useState<User | null>(supabaseClient.auth.session()?.user || null)
    useEffect(()=> {
        const cleanup = supabaseClient.auth.onAuthStateChange((_ev, session)=> {
            if(userHasChanged(user, session)) {
                setUser(session?.user || null)
            }
        })

        return () => {
            console.log("clearing up auth subscription")
            cleanup.data?.unsubscribe()
        }
    },[])

    return <AuthContext.Provider value={{ user }}>
        {children}
    </AuthContext.Provider>
}
// checks whether the user has changed
const userHasChanged = (currentUser: User | null, session: AuthSession | null) => {
    return currentUser?.id !== session?.user?.id
}

export const useAuth = () => {
    const auth = useContext(AuthContext)
    return auth
}
