import Image from "next/image";
import Link from "next/link";
import { ProfileBooksProps } from "../../../../../types";

const ProfileBooks = ({posts}: ProfileBooksProps) => {
  return (  
    <section className="h-[100dvh] p-2">
      <div className="grid grid-cols-3 gap-2 p-2">
        {posts.map((item) =>
          (
            <div key={item.id} className="relative w-full aspect-[2/3]">
              <Link href={`/profile/post/${item.id}/${item.username}`} className="block w-full h-full">
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