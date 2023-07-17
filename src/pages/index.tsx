import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import TodoForm from "~/components/TodoForm";
import TodoList from "~/components/TodoList";

export default function Home() {
  return (
    <>
      <Head>
        <title>T3-Do</title>
        <meta name="description" content="Todo list app made using T3-Stack" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <div>
            <h1 className="text-center text-6xl font-bold text-white">T3-Do</h1>
            <p className="text-center text-2xl text-white">
              A T3-Stack To-Do list app!
            </p>
          </div>
          <TodoForm />
          <TodoList />
          <div className="flex flex-col items-center gap-2">
            <AuthShowcase />
          </div>
        </div>
      </main>
    </>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();

  /* const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );*/

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {/* {secretMessage && <span> - {secretMessage}</span>} */}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
}
