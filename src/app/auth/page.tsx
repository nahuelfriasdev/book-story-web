"use client"
import Image from "next/image";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";

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
        {/* <section className="flex flex-col flex-2 justify-between items-center py-3">
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

        </section> */}
        <section className="flex bg-green-400 flex-1 justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-md rounded-3xl shadow-lg">
        <CardHeader className="pb-0">
          <CardTitle className="text-center text-2xl font-semibold">
            Bienvenido
          </CardTitle>
        </CardHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-lg bg-gray-100">
            <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
            <TabsTrigger disabled value="register">Registrarme</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <CardContent className="flex flex-col gap-4 mt-6">
              <Input
                placeholder="Email"
                type="email"
                onChange={(e) => (emailRef.current = e.target.value)}
              />
              <Input
                placeholder="Contraseña"
                type="password"
                onChange={(e) => (passwordRef.current = e.target.value)}
              />
              <Button variant="default" onClick={handleSubmit}>
                Iniciar
              </Button>
            </CardContent>
          </TabsContent>

          <TabsContent value="register">
            <CardContent className="flex flex-col gap-4 mt-6">
              <Input placeholder="Email" type="email" />
              <Input placeholder="Contraseña" type="password" />
              <Input placeholder="Nombre" type="text" />
              <Button variant="default">Registrarme</Button>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </section>
      </main>

    </>
  );
}
