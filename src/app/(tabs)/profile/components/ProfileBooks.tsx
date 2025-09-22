"use client"
import { useAuth } from "@/contexts/authContext";
import { getPostsByUser } from "@/services/bookServices";
import Image from "next/image";
import { useEffect, useState } from "react";
import AddBook from "./AddBook";
import Link from "next/link";

const ProfileBooks = () => {
  const [books, setBooks] = useState<{id: string, image?: string, isAddButton?: boolean}[]>([]);
  const {user} = useAuth();
  
  const fetchBooks = async (uid = user?.uid) => {
    if(!uid) return;

    const data = await getPostsByUser(uid)

    const newBooks = data.map((book: {id:string, thumbnail?:string}) => ({
      id: book.id,
      image: book.thumbnail
    }));
    setBooks([{ id: "add", isAddButton: true }, ...newBooks]);
  }

  useEffect(() => {
    fetchBooks()
  },[])

  return (
    <section className="h-[100dvh] p-2">
      <div className="grid grid-cols-3 gap-2 p-2">
        {books.map((item) =>
          item.isAddButton ? (
            <AddBook key={item.id} onBookAdded={fetchBooks}/>
          ) : (
            <div key={item.id} className="relative w-full aspect-[2/3]">
              <Link href={`profile/post/${item.id}`} className="block w-full h-full">
                <Image
                  src={item.image || "/book-stack.png"}
                  alt="Book cover"
                  fill
                  className="object-cover rounded-lg"
                />
              </Link>
            </div>
          )
        )}
      </div>
    </section>
  )
}

export default ProfileBooks;