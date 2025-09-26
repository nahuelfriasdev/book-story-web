"use client"

import { useParams } from "next/navigation";
import ProfileBooks from "../components/ProfileBooks";
import ProfileHeader from "../components/ProfileHeader";
import { useEffect, useState } from "react";
import { getUsers } from "@/services/userServices";
import { getPostsByUser } from "@/services/bookServices";

const Profile = () => {
  const [user, setUser] = useState<{id:string, username: string, image?: string}[]>([]);
  const [allpost, setAllPost] = useState<{id:string, image:string, username:string}[]>([]);
  const {username} = useParams();

  const getUserInfo = () => {
    const data = getUsers(username?.toString() || "");
    data.then((res) => {
      if (res.length > 0) {
        setUser(res);
        const posts = getPostsByUser(res[0].id);
        posts.then((postRes) => {
          if (postRes.length > 0) {
           const allPostRes = postRes.map((post: {id:string, thumbnail?:string}) => ({
              id: post.id,
              image: post.thumbnail || "",
              username: res[0].username
            }))
            setAllPost(allPostRes);
          }
        })
      } 
    })
  }

  useEffect(() => {
    getUserInfo()
  },[username])

  return (
    <>
      <ProfileHeader username={user[0]?.username} image={user[0]?.image}/>
      <ProfileBooks posts={allpost}/>
    </>
  )
}

export default Profile;