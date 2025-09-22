"use client"
import { useAuth } from "@/contexts/authContext";
import { getBooksByUser } from "@/services/bookServices";
import Image from "next/image";
import { useEffect, useState } from "react";
import AddBook from "./AddBook";

const ProfileBooks = () => {
  const [books, setBooks] = useState<{id: string, image?: string, isAddButton?: boolean}[]>([]);
  const {user} = useAuth();
  
  const fetchBooks = async (uid = user?.uid) => {
    if(!uid) return;

    const data = await getBooksByUser(uid)

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
              <Image
                src={item.image || "/book-stack.png"}
                alt="Book cover"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          )
        )}
      </div>
    </section>
  )
}

export default ProfileBooks;