"use client"

import PostCard from "@/components/PostCard";
import { useAuth } from "@/contexts/authContext"
import { getProfileImage } from "@/services/imageServices";

const Home = () => {
  const {user} = useAuth();
  if(!user) return null;

  const profileImage = getProfileImage(user?.image ?? "/defaultAvatar.png") ?? "/defaultAvatar.png"

  return (
    <>
      <section>
        <header className="flex items-center gap-x-2 border-b border-gray-200 p-4">
          {[1,2,3,4,5].map((item) => {
            return <div key={item} className="h-10 w-10 bg-gray-800 rounded-full animate-pulse"></div>
          })}
        </header>

        {[1,2,3,4].map((item) => {
          return (
           <PostCard key={item} user={user} image={profileImage}/>
          )
        })}
        
      </section>
    </>
  )
}

export default Home;