"use client"
import { getPostById } from "@/services/bookServices"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation";
import { BooksPropsType, UserType } from "../../../../../../../types";
import { getProfileImage } from "@/services/imageServices";
import PostCard from "@/components/PostCard";
import { getUsers } from "@/services/userServices";


export default function BookPage() {
  const [post, setPost] = useState<BooksPropsType>()
  const [user, setUser] = useState<UserType>()

  const params = useParams<{ id: string, username:string }>();
  console.log("Params:", params);

  const profileImage = getProfileImage(user?.image ?? "/defaultAvatar.png") ?? "/defaultAvatar.png"

  const getUserData = async () => {
    const userData = await getUsers(params.username ?? "");
    if(!userData || userData.length === 0) return;
    setUser(userData[0])
    const postData = await getPostById(params.id, userData[0].id);
    if(!postData) return;
    setPost(postData)
  }

  useEffect(() => {
    getUserData()
  },[params.id, user?.uid])

  return (
    <>
      {user && (
        <PostCard user={user} image={profileImage} post={post}/>
      )}
    </>
  )
}