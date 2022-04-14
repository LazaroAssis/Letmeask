import firebase from "firebase/compat/app"
import { createContext, ReactNode, useEffect, useState } from "react"
import { auth } from "../services/firebase"

type User = {
    id: string
    name: string
    avatar: string
  }
  
  
  type authContextType = {
    user: User | undefined
    signInGoogle: () => Promise<void> 
  }


type AuthContextProviderProps = {
    children: ReactNode
}

export const AuthContext = createContext({} as authContextType)


export function AuthContextProvider(props: AuthContextProviderProps) {
   
   
    const [user, setUser] = useState<User>()

    useEffect(() => {
      const unSubsCribe = auth.onAuthStateChanged(user => {
        if(user) {
          const { displayName, photoURL, uid } = user
    
          if(!displayName || !photoURL){
            throw new Error('Missing information from Google Account.')
          }
          setUser({
            id: uid,
            name: displayName,
            avatar: photoURL
          })
        }
      })
    
      return () => {
        unSubsCribe()
      }
    }, [])
    
    async function signInGoogle() {
        const provaider = new firebase.auth.GoogleAuthProvider();       
        const result = await auth.signInWithPopup(provaider)
    
        if(result.user){
          const { displayName, photoURL, uid } = result.user
    
          if(!displayName || !photoURL){
            throw new Error('Missing information from Google Account.')
          }
          setUser({
            id: uid,
            name: displayName,
            avatar: photoURL
          })
        }      
    }
   
   
   
   
   
    return (
        <AuthContext.Provider value={{ user, signInGoogle }}>
            {props.children}
        </AuthContext.Provider>
    )
}