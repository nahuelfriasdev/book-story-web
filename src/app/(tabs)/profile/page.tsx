"use client";
import { useAuth } from "@/contexts/authContext";
import ProfileBooks from "./components/ProfileBooks";
import ProfileHeader from "./components/ProfileHeader";
import { useEffect, useState } from "react";
import { getPostsByUser } from "@/services/bookServices";

const Profile = () => {
  const [allPost, setAllPost] = useState<{id:string, image:string, username:string}[]>([]);
  const {user} = useAuth();
  console.log(user)
  const getPost = () => {
    if(!user) return;
    const posts = getPostsByUser(user?.uid || "");

    posts.then((postRes) => {
      if (postRes.length > 0) {
       const allPostRes = postRes.map((post: {id:string, thumbnail?:string}) => ({
          id: post.id,
          image: post.thumbnail || "",
          username: user?.username
        }))
        setAllPost(allPostRes);
      }
    })
  }

  useEffect(() =>{
    getPost()
  }, [])
  if(!user) return;
  return (
    <>
      <ProfileHeader username={user?.username} image={user?.image}/>
      <ProfileBooks posts={allPost}/>
    </>
  )
}

export default Profile;