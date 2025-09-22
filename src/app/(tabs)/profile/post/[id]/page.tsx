"use client"
import { getPostById } from "@/services/bookServices"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation";
import { BooksPropsType } from "../../../../../../types";
import { useAuth } from "@/contexts/authContext";
import Image from "next/image";
import { getProfileImage } from "@/services/imageServices";
import { Star } from "lucide-react";


export default function BookPage() {
  const [book, setBook] = useState<BooksPropsType>()

  const params = useParams<{ id: string }>();
  const {user} = useAuth();


  const getBookData = async (id: string, uid:string) => {

    const book = await getPostById(id, uid);
    
    if(!book) return;

    setBook(book)
    console.log("book", book)
  }

  useEffect(() => {
    getBookData(params.id, user?.uid ?? "")
  },[params.id])

  return (
    <>
      <article>
        <header className="flex items-center gap-4 mb-4 p-4 border-b border-gray-300">
          <div className="flex items-center gap-4">
            <Image 
              src={getProfileImage(user?.image ?? "/defaultAvatar.png") || "/defaultAvatar.png"}
              alt="User Avatar"
              width={50}
              height={50}
              className="rounded-full"
            />
            <p>{user?.name}</p>
          </div>
        </header>

        <div className="flex flex-col gap-y-2 border-b border-gray-300">
          <h1 className="text-2xl font-bold mb-2 text-center">{book?.title}</h1>
          <Image 
            src={
              Array.isArray(book?.thumbnail) ? book?.thumbnail[0] : book?.thumbnail || "/defaultBook.png"
            } 
            alt={
              Array.isArray(book?.title) ? book?.title[0] : book?.title || "Portada de libro"
            } 
            width={200} 
            height={300} 
            className="mx-auto mb-4 object-cover"
          />
        </div>

        <div>
          <div className="flex items-center gap-1 mt-4">
            {[1,2,3,4,5].map((star) => (
              <span key={star} className={star <= (book?.rating ?? 0) ? "text-yellow-500" : "text-gray-400"}><Star fill="currentColor"/></span>
            ))}
          </div>
          <p className="mt-2">{book?.review}</p>
        </div>


      </article>
    </>
  )
}