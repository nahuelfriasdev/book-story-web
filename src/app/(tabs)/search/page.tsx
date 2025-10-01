"use client"
import { Input } from "@/components/ui/input"
import { getUsers } from "@/services/userServices";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Search = () => {
  const [users, setUsers] = useState<{ uid: string, username: string, image: string }[]>([])


  const handleSearch = async (username: string) => {
    if (username.length <= 3) return;
    const data = await getUsers(username);
    if (data != null) {
      setUsers(data);
    }
  }

  return (
    <>
      <section className="p-4">
        <header>
          <Input onChange={(e) => handleSearch(e.target.value)}/>
        </header>

        <article>
          {users.map((user) => (
            <Link href={`/profile/${user.username}`} key={user.username} className="flex items-center h-10 p-3 bg-gray-200 my-2 rounded gap-x-2">
              <Image 
                src={user.image ?? "/defaultAvatar.png"} 
                className="h-8 w-8 bg-gray-700 rounded-full"
                alt="profile picture"
                width={32}
                height={32}
              />
              <h2>{user.username}</h2>
            </Link>
          ))}
        </article>
      </section>
    </>
  )
}

export default Search;