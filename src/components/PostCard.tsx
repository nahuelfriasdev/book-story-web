import Image from "next/image";
import { PostCardPropsType } from "../../types";
import { Star } from "lucide-react";

const PostCard = ({user, image, post}: PostCardPropsType) => {
  if(!user) return null;
  console.log("post in post card", post)

  const postImage = Array.isArray(post?.thumbnail) ? post?.thumbnail[0] : post?.thumbnail

  return(
    <article key={user.name}>
      <header className="p-3 border-b border-gray-200 flex items-center gap-x-2">
        <Image className="rounded-full"
          src={image}
          alt="Imagen de perfil"
          width={32}
          height={32}
        />
        <p>{user.name}</p>
      </header>

      <div className={`h-96 w-full ${postImage ? "" : "bg-gray-800 animate-pulse" } flex items-center justify-center`}>
        {postImage && (
            <Image 
            src={postImage}
            alt={post?.title ? (Array.isArray(post?.title) ? post?.title[0] : post?.title) : "Portada de libro"} 
            className="mx-auto mb-4 object-cover"
            width={200}
            height={384}
            />
        )}
      </div>
      
      <footer className="w-full border-t border-gray-200 p-2">
        <p className="font-medium">{post?.title} <span className="font-normal text-gray-400">({post?.authors})</span></p>
        <div className="flex items-center gap-1 my-2">
          {[1,2,3,4,5].map((star) => (
            <span key={star} className={star <= (post?.rating ?? 0) ? "text-yellow-500" : "text-gray-400"}><Star fill="currentColor"/></span>
          ))}
        </div>
        <p className="text-wrap"><span className="font-medium">{user.name}: </span>{post?.review}</p>
      </footer>
    </article>
  )
}

export default PostCard;