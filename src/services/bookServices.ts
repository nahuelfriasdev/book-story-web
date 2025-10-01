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

export const addPost = async ({
  id,
  uid, 
  username,
  authors, 
  thumbnail, 
  title,
  rating,
  review,
}: BooksPropsType) => {
  try {
    const titleFormat = Array.isArray(title) ? title[0]?.toLocaleLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') : title?.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    const titleTrimmed = titleFormat?.trim();
    await setDoc(doc(firestore, "posts", `${uid}_${titleTrimmed}`), {
      id,
      titleTrimmed,
      authors, 
      thumbnail, 
      review,
      rating,
      username,
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

export const getPostsByUser = async (uid:string) => {
  try {
    const postsRef = collection(firestore, "posts");

    const q = query(
      postsRef, 
      where("uid", "==", uid),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);

    const posts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      uid: doc.data().uid, 
      authors: doc.data().authors, 
      thumbnail: doc.data().thumbnail, 
      title: doc.data().title,
      review: doc.data().review,
      rating: doc.data().rating,
      createdAt: doc.data().createdAt,
      ...doc.data()
    }));

    return posts;
  } catch (error) {
    console.error("Error fetching posts: ", error);
    return [];
  }
}

export const getPostById = async (id:string, uid:string) => {
  try {
    const postRef = collection(firestore, "posts");
    const q = query(
      postRef, 
      where("uid", "==", uid),
      where("id", "==", id)
    );

    const postSnap = await getDocs(q);

    if (postSnap.empty) {
      console.log("No matching documents.");
      return null;
    }
    return postSnap.docs[0].data();
  } catch (error) {
    console.error("Error fetching post by ID: ", error);
    return null;
  }
}
