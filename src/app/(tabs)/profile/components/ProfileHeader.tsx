"use client"
import { getProfileImage } from "@/services/imageServices";
import Image from "next/image";

const ProfileHeader = ({username, image}: {username:string, image:unknown}) => {


  return (
    <section className="p-4 flex flex-col items-center gap-y-2">
      <Image 
        src={getProfileImage(image ?? "/defaultAvatar.png") || "/defaultAvatar.png"}
        alt="foto de perfil o avart default"
        width={100}
        height={100}
        className="rounded-full bg-cover"
      />


      <p className="text-xl font-medium">{username}</p>
    </section>

  )
}

export default ProfileHeader;