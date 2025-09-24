"use client"

import { Button } from "@/components/ui/button";
import { auth } from "@/config/firebase";
import { signOut } from "firebase/auth";

const Setting = () => {
  const handleLogout = () => {
    signOut(auth);
  }

  return (
    <div>
      <h1>Settings Page</h1>

      <Button onClick={handleLogout} className="bg-green-300 text-black p-4">logout</Button>
    </div>
  )
}

export default Setting;