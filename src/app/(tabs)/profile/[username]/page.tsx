"use client"

import { useParams } from "next/navigation";
import ProfileBooks from "../components/ProfileBooks";
import ProfileHeader from "../components/ProfileHeader";
import { useEffect, useState } from "react";
import { getUsers } from "@/services/userServices";
import { getPostsByUser } from "@/services/bookServices";
import { UserType } from "../../../../../types";

const Profile = () => {
  const [user, setUser] = useState<UserType>();
  const [allpost, setAllPost] = useState<{id:string, image:string, username:string}[]>([]);
  const {username} = useParams();

  const getUserInfo = () => {
    const data = getUsers(username?.toString() || "");
    data.then((res) => {
      if (res.length > 0) {
        setUser(res[0]);
        const posts = getPostsByUser(res[0].uid);
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
      {user && (
        <ProfileHeader
          uid={user.uid}
          email={user.email}
          name={user.name}
          image={user.image}
          username={user.username}
        />
      )}
      <ProfileBooks posts={allpost}/>
    </>
  )
}

export default Profile;