"use client"
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/authContext";

const Home = () => {
  const {user} = useAuth();

  return (
    <div>
      <h1>Home Page</h1>
    </div>
  )
}

export default Home;