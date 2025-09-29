import { firestore } from "@/config/firebase";
import { addDoc, collection, deleteDoc, doc, getDocs, query, serverTimestamp, where } from "firebase/firestore";

export async function getUsers (username: string) {
  try {
    const usersRef = collection(firestore, "users");

    const q = query(
      usersRef,
      where("username_lowercase", "==", username.toLocaleLowerCase())
    )

    const querySnapshot = await getDocs(q);

    const user = querySnapshot.docs.map(doc => ({
      uid: doc.id,
      username: doc.data().username,
      image: doc.data().image || null,
      email: doc.data().email || null,
      name: doc.data().name || null,
      username_lowercase: doc.data().username_lowercase
    }))
    return user;
  } catch (error) {
    console.error("Error fetching users: ", error);
    return [];
  }
}


export async function followUser(followerId: string, followingId: string) {
  try {

    const followRef = collection(firestore, "follows")

    const queryCheckFollow = query(
      followRef,
      where("followerId", "==", followerId),
      where("followingId", "==", followingId)
    )

    const querySnapshot = await getDocs(queryCheckFollow);

    const follow = querySnapshot.docs.map(doc => ({
      uid: doc.id,
    }))

    if(follow.length > 0) {
      await deleteDoc(doc(firestore, "follows", follow[0].uid))

      return { success: true };
    }

    const docRef = await addDoc(collection(firestore, "follows"), {
      followerId,
      followingId,
      createdAt: serverTimestamp()
    })

    return { success: true, id: docRef.id };

  } catch (error) {
    console.error("Error following user: ", error);
  }
}

export async function getFollowInfo(uid: string, userId: string) {
  try {
    const followRef = collection(firestore, "follows")

    const q = query(
      followRef,
      where("followerId", "==", uid),
      where("followingId", "==", userId)
    )

    const querySnapshot = await getDocs(q);

    const follow = querySnapshot.docs.map(doc => ({
      uid: doc.id,
    }))

    console.log("follow: ",follow.length > 0)

    return follow.length > 0;  

  } catch (error) {
    console.error("Error following user: ", error);
  }
}


