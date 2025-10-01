"use client"
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/authContext";
import { getProfileImage } from "@/services/imageServices";
import { followUser, getFollowInfo} from "@/services/userServices";
import Image from "next/image";
import { UserType } from "../../../../../types";
import { useEffect, useState } from "react";

const ProfileHeader = (users: UserType) => {
  const [isFollowing, setIsFollowing] = useState<boolean | undefined>(false)

  const {user} = useAuth();

  const handleFollow = async () => {
    await followUser(user?.uid || "", users?.uid || "");
    setIsFollowing(!isFollowing)
  }

  const checkFollow = async () =>{ 
    const res = await getFollowInfo(user?.uid || "", users?.uid || "")
    setIsFollowing(res)
  }

  useEffect(() => {
    checkFollow()
  },[isFollowing])

  return (
    <section className="p-4 flex flex-col items-center gap-y-2">
      <Image 
        src={getProfileImage(users?.image ?? "/defaultAvatar.png") || "/defaultAvatar.png"}
        alt="foto de perfil o avart default"
        width={100}
        height={100}
        className="rounded-full bg-cover"
      />
      <p className="text-xl font-medium">{users?.username}</p>
      {user?.username != users?.username && (
        <Button onClick={handleFollow}>{isFollowing ? "Dejar de seguir" : "Seguir"} </Button>
      )}
    </section>

  )
}

export default ProfileHeader;