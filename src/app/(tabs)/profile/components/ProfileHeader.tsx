"use client"
import { useAuth } from "@/contexts/authContext";
import { getProfileImage } from "@/services/imageServices";
import Image from "next/image";

const ProfileHeader = () => {
  const {user} = useAuth();

  return (
    <section className="p-4 flex flex-col items-center gap-y-2">
      <Image 
        src={getProfileImage(user?.image ?? "/defaultAvatar.png") || "/defaultAvatar.png"}
        alt="foto de perfil o avart default"
        width={100}
        height={100}
        className="rounded-full bg-cover"
      />


      <p className="text-xl font-medium">{user?.name}</p>
    </section>

  )
}

export default ProfileHeader;