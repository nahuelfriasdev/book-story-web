"use client"
import { getPostById } from "@/services/bookServices"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation";
import { BooksPropsType } from "../../../../../../types";
import { useAuth } from "@/contexts/authContext";
import { getProfileImage } from "@/services/imageServices";
import PostCard from "@/components/PostCard";


export default function BookPage() {
  const [post, setPost] = useState<BooksPropsType>()

  const params = useParams<{ id: string }>();
  const {user} = useAuth();

  const profileImage = getProfileImage(user?.image ?? "/defaultAvatar.png") ?? "/defaultAvatar.png"

  const getBookData = async (id: string, uid:string) => {
    const postData = await getPostById(id, uid);
    if(!postData) return;
    setPost(postData)
  }

  useEffect(() => {
    getBookData(params.id, user?.uid ?? "")
  },[params.id])

  return (
    <>
      <PostCard user={user} image={profileImage} post={post}/>
    </>
  )
}