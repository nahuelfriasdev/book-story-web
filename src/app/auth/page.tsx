"use client"
import Image from "next/image";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  const emailRef = useRef("");
  const passwordRef = useRef("");
  const router = useRouter();
  const {login: loginUser} = useAuth();

  const handleSubmit = async () => {
    if(!emailRef.current || !passwordRef.current) {
      alert("Porfavor completa todos los campos");
      return;
    }

    setIsLoading(true)
    const res = await loginUser(emailRef.current, passwordRef.current)
    setIsLoading(false)
    if(!res.success) {
      alert(res.msg)
    }
  }

  return (
    <>
      <main className="flex w-[100%] h-[100vh]">
        <section className="flex flex-col flex-2 justify-between items-center py-3">
          <h1 className="w-[100%] text-5xl">BOOKSTORY</h1>
          <Image 
            src="/book-stack.png"
            alt="una pila de libros"
            width={300}
            height={300}
          />
          
          <article className="flex flex-col justify-center items-center text-center text-4xl ">
            <h2>Comparte lo que lees</h2>  
            <h2>conecta con otros lectores</h2>
            <h2>Inspirate y compartí tus lecturas favoritas</h2>
            <h2>Encontrá personas que leen como vos</h2>
          </article>

        </section>
        <section className="flex bg-[#4ade80] flex-1 justify-center items-center">
          <article className="bg-white w-[75%] h-[75%] rounded-4xl flex flex-col">
            <div className="flex items-center text-center w-[100%] border-b-1 border-gray-200">
              <button className="w-full p-4 border-r-1 border-gray-200 hover:bg-amber-200 rounded-tl-4xl">Iniciar Sesion</button>
              <button className="w-full p-4 hover:bg-amber-200 rounded-tr-4xl">Registrarme</button>
            </div>
            
            <div className="flex flex-col gap-y-4 items-center justify-center mt-10">
              <input onChange={e => emailRef.current = e.target.value} type="text" placeholder="Email" className="border px-1 py-2 border-[#4ade80] rounded-sm w-[70%]" />
              <input onChange={e => passwordRef.current = e.target.value} type="password" placeholder="Contraseña" className="border px-1 py-2 border-[#4ade80] rounded-sm w-[70%]" />
              <button type="button" className="bg-[#4ade80] w-[70%] rounded-md p-2 cursor-pointer" onClick={handleSubmit}>Iniciar</button>
            </div>
          </article>
        </section>
      </main>

    </>
  );
}
