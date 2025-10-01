"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { AuthContextType, BooksPropsType, UserType } from "../../types";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth, firestore } from "../config/firebase";
import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { getPostsByUser } from "@/services/bookServices";

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [user, setUser] = useState<UserType>(null)
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if(firebaseUser) {
        setUser({
          uid: firebaseUser?.uid,
          email: firebaseUser?.email,
          name: firebaseUser?.displayName,
          username:"",
          username_lowercase:""
        })
        updateUserData(firebaseUser.uid);
        router.push("/home")
      } else {
        setUser(null)
        router.replace("/auth")
      }
    }) 

    return () => unsub();  
  },[])

  const getFollowersPost = async (userId:string): Promise<BooksPropsType[]> => {
    try {
      const post: BooksPropsType[] = [];
      const followersRef = collection(firestore, "follows");

      if(!userId) return [];
      const queryGetFollows = query(
        followersRef,
        where("followerId", "==", userId)
      );

      const queryFollowSnapshot = await getDocs(queryGetFollows);

      const follows = queryFollowSnapshot.docs.map(doc => ({
        followingId: doc.data().followingId,
      }));

      // Use Promise.all to await all async calls
      const postsArrays = await Promise.all(
        follows.map(async (follow) => {
          const res = await getPostsByUser(follow.followingId);
          return res;
        })
      );

      // Flatten the array of arrays and filter out any undefined/null
      postsArrays.forEach(arr => {
        if (Array.isArray(arr)) {
          post.push(...arr);
        }
      });
      return post;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("login success")
      return {success: true}
    } catch(error: unknown) {
      console.log("login bad")

      let msg = "An error occurred";
      if (error && typeof error === "object" && "message" in error) {
        msg = (error as { message: string }).message;
      }
   
      return { success: false, msg}
    }
  }

  const register = async (email: string, password: string, name:string, username:string) => {
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(firestore, "users", response?.user?.uid), {
        name,
        username: username,
        username_lowercase: username.toLocaleLowerCase(),
        email,
        uid: response?.user?.uid,
        createdAt: serverTimestamp()
      })
      return {success: true}
    } catch(error: unknown) {
      let msg = "An error occurred";
      if (error && typeof error === "object" && "message" in error) {
        msg = (error as { message: string }).message;
        if (msg.includes("/(auth/email-alredy-in-use)")) msg = "El email esta en uso";
      }
      return { success: false, msg}
    }
  };

  const updateUserData = async (uid: string) => {
    try {
      const docRef = doc(firestore, "users", uid);
      const docSnap = await getDoc(docRef)
      if(docSnap.exists()) {
        const data = docSnap.data()
        const userData: UserType = {
          uid: data?.uid,
          email: data.email || null,
          name: data.name || null,
          image: data.image || null,
          username: data.username || null,
          username_lowercase: data.username_lowercase || null,
        }
        setUser({...userData})
      }
    } catch(error: unknown) {
      console.log("error:", error)
    }
  }

  const contextValue: AuthContextType = {
    user,
    setUser,
    login,
    register,
    updateUserData,
    getFollowersPost
  }

  return(
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if(!context) {
    throw new Error("useAuth must be wrapper inside AuthProvider")
  }

  return context;
}