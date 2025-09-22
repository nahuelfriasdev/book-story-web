import { firestore } from "@/config/firebase";
import axios from "axios";
import { collection, doc, getDocs, orderBy, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { BooksPropsType } from "../../types";

export const fetchBooks = async (query: string) => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`
    );
    const data = await response.data;

    return data.items?.map((item: {id:string, volumeInfo: {title: string, authors: string, imageLinks: {thumbnail: string}, description: string}}) => ({
      id: item.id,
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors || [],
      thumbnail: item.volumeInfo.imageLinks?.thumbnail,
      description: item.volumeInfo.description,

    })) || [];
  } catch (error) {
    console.error("❌ Error al buscar libros:", error);
    return [];
  }
};

export const addBook = async ({
  uid, 
  authors, 
  thumbnail, 
  title,
  rating,
  review,
}: BooksPropsType) => {
  try {
    await setDoc(doc(firestore, "books", `${uid}_${title}`), {
      title,
      authors, 
      thumbnail, 
      review,
      rating,
      uid,
      createdAt: serverTimestamp()
    })
    return {success: true}
  } catch(error: unknown) {
    let msg = "An unknown error occurred";
    if (error instanceof Error) {
      msg = error.message;
    }
    return { success: false, msg}
  }
}

export const getBooksByUser = async (uid:string) => {
  try {
    // Referencia a la colección "books"
    const booksRef = collection(firestore, "books");

    // Creamos la consulta
    const q = query(
      booksRef, 
      where("uid", "==", uid),
      orderBy("createdAt", "desc")
    );

    // Ejecutamos la consulta
    const querySnapshot = await getDocs(q);

    // Convertimos los resultados a un array
    const books = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return books;
  } catch (error) {
    console.error("Error fetching books: ", error);
    return [];
  }
}
