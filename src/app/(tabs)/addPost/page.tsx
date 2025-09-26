"use client"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { addPost, fetchBooks } from "@/services/bookServices"
import Image from "next/image"
import { useAuth } from "@/contexts/authContext"
import { BooksPropsType } from "../../../../types"

type AddBookProps = {
  onBookAdded?: () => void;  // 👈 nuevo prop
};

const AddPost = ({ onBookAdded }: AddBookProps) => {
  const {user} = useAuth();
  const [title, setTitle] = useState("")
  const [books, setBooks] = useState<BooksPropsType[]>([])
  const [selectedBook, setSelectedBook] = useState<BooksPropsType | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [dialog, setDialog] = useState(false)
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const handleSearch = async () => {
    const res = await fetchBooks(title)
    setBooks(res)
    console.log(res);
  }

  const handleSelectBook = (book: BooksPropsType) => {
    setSelectedBook(book)
    console.log(book);
    setIsOpen(true)
  }

  const handleAddReview = async () => {
    if (!user?.uid || !selectedBook) return;

    const data = {
      id:selectedBook.id,
      uid: user.uid,
      authors: Array.isArray(selectedBook.authors) ? selectedBook.authors[0] : selectedBook.authors,
      thumbnail: Array.isArray(selectedBook.thumbnail) ? selectedBook.thumbnail[0] : selectedBook.thumbnail,
      title: selectedBook.title,
      rating,
      review
    }

    const res = await addPost(data)

    if(!res.success) {
      alert(res.msg)
      return;
    }
    setDialog(false);       // 👈 cerramos modal
    setIsOpen(false);
    setTitle("");
    setBooks([]);
    setSelectedBook(null);

    if (onBookAdded) {
      onBookAdded();        // 👈 avisamos al padre que refresque
    }
  }

  return (
    <Dialog open={dialog} onOpenChange={(open) => {
      setDialog(open)
      if(!open) {
        if(!user?.uid) return;
        fetchBooks(user?.uid)
      }
    }}>
      <DialogTrigger asChild>
        <button
          className="flex items-center justify-center bg-gray-200 text-gray-600 text-3xl rounded-lg aspect-[2/3]"
          type="button"
        >
          +
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Agregar nuevo libro</DialogTitle>
          <DialogDescription>
            Completa los datos para añadir un libro a tu biblioteca 📚
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4 max-h-[40dvh] overflow-y-auto">
          {!isOpen && 
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">Título</label>
              <Input
                placeholder="El Principito"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          }

          {!isOpen 
            ? 
            books.length > 0 &&
              books.map((book, index) => {
                return (
                  <button key={index} className="flex gap-2 cursor-pointer" type="button" onClick={() => handleSelectBook(book)}>
                    {book.thumbnail && (
                      <Image 
                        src={Array.isArray(book.thumbnail) ? book.thumbnail[0] : book.thumbnail}
                        alt={typeof book.title === "string" ? book.title : Array.isArray(book.title) ? book.title[0] ?? "Book cover" : "Book cover"}
                        width={50}
                        height={75}
                        className="object-cover rounded-lg"
                      />
                    )}

                    <p>{book.title}</p>
                  </button>
                )
              })
            : 
            <div>
              <div className="flex gap-4 mb-4">
                <Image 
                  src={
                    selectedBook?.thumbnail
                      ? Array.isArray(selectedBook.thumbnail)
                        ? selectedBook.thumbnail[0]
                        : selectedBook.thumbnail
                      : "/book-stack.png"
                  }
                  alt={
                    typeof selectedBook?.title === "string"
                      ? selectedBook.title
                      : Array.isArray(selectedBook?.title)
                        ? selectedBook.title[0] ?? "Book cover"
                        : "Book cover"
                  }
                  width={100}
                  height={150}
                  className="object-cover rounded-lg"
                />
                <h3 className="text-base font-medium">{selectedBook?.title}</h3>
              </div>

              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} onClick={() => setRating(star)} className={`text-2xl ${star <= rating ? "text-yellow-500" : "text-gray-500"}`}>★</span>
              ))}

              <Input className="mt-4" placeholder="Escribe tu reseña..." onChange={(e) => setReview(e.target.value)}/>
              
            </div>
          }
        </div>
        <DialogFooter className={`${isOpen ? "flex flex-row gap-x-4 flex-1" : "justify-end"}`}>
          {isOpen && <Button className="bg-red-500 text-black/80" onClick={() => setIsOpen(false)}>Volver</Button>}
          <Button className="bg-green-400 text-black/80 font-medium flex-1" onClick={isOpen ? handleAddReview : handleSearch}>{isOpen ? "Agregar" : "Buscar"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddPost
