"use client"

import PostCard from "@/components/PostCard";
import { useAuth } from "@/contexts/authContext"
import { getProfileImage } from "@/services/imageServices";
import { useEffect, useState } from "react";
import { BooksPropsType } from "../../../../types";

const Home = () => {
  const[post, setPost] = useState<BooksPropsType[]>([])
  const {user, getFollowersPost} = useAuth();
  
  const profileImage = getProfileImage(user?.image ?? "/defaultAvatar.png") ?? "/defaultAvatar.png"
  
  const getPost = async () => {
    if(!user) return null;

    if(!user.uid) return;
    const data = await getFollowersPost(user?.uid ?? "")
    console.log("data:", data)
    setPost(data)
  }

  useEffect(()=> {
    getPost()
  },[user?.uid])

  if(!user) return null;
  return (
    <>
      <section>
        <header className="flex items-center gap-x-2 border-b border-gray-200 p-4">
          {[1,2,3,4,5].map((item) => {
            return <div key={item} className="h-10 w-10 bg-gray-800 rounded-full animate-pulse"></div>
          })}
        </header>
          
        {post.map((item) => {
            return (
            <PostCard key={item.id} user={user} image={profileImage} post={item}/>
            )
          })
        }
        
      </section>
    </>
  )
}

export default Home;