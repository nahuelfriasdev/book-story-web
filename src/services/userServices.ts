import { firestore } from "@/config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export async function getUsers (username: string) {
  try {

    const usersRef = collection(firestore, "users");

    const q = query(
      usersRef,
      where("username", "==", username)
    )

    const querySnapshot = await getDocs(q);

    const users = querySnapshot.docs.map(doc => ({
      id: doc.id,
      username: doc.data().username,
      image: doc.data().image || null,
      email: doc.data().email || null,
      name: doc.data().name || null,
    }))
    return users;
  } catch (error) {
    console.error("Error fetching users: ", error);
    return [];
  }
}
