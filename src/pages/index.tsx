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
      <header
        className={`bg-[url(/bg-mobile-dark.jpg)] bg-cover  bg-no-repeat px-6 pb-11 pt-12 md:bg-[url(/bg-desktop-dark.jpg)] `}
      >
        <div className="mx-auto flex max-w-xl  flex-wrap items-center justify-between">
          <div className="mb-10">
            <h1 className=" text-6xl font-bold tracking-[10px] text-white">
              T3-Do
            </h1>
            <p className=" text-2xl text-white">A T3-Stack To-Do list app!</p>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26">
            <path
              fill="#FFF"
              fillRule="evenodd"
              d="M13 21a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-5.657-2.343a1 1 0 010 1.414l-2.121 2.121a1 1 0 01-1.414-1.414l2.12-2.121a1 1 0 011.415 0zm12.728 0l2.121 2.121a1 1 0 01-1.414 1.414l-2.121-2.12a1 1 0 011.414-1.415zM13 8a5 5 0 110 10 5 5 0 010-10zm12 4a1 1 0 110 2h-3a1 1 0 110-2h3zM4 12a1 1 0 110 2H1a1 1 0 110-2h3zm18.192-8.192a1 1 0 010 1.414l-2.12 2.121a1 1 0 01-1.415-1.414l2.121-2.121a1 1 0 011.414 0zm-16.97 0l2.121 2.12A1 1 0 015.93 7.344L3.808 5.222a1 1 0 011.414-1.414zM13 0a1 1 0 011 1v3a1 1 0 11-2 0V1a1 1 0 011-1z"
            />
          </svg>
          <TodoForm />
        </div>
      </header>
      <main className=" mt-[-1.5rem] block px-6">
        <div className="mb-4 ml-auto mr-auto max-w-xl ">
          <TodoList />
        </div>
      </main>

      <AuthShowcase />
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
    <div className=" mt-10 flex flex-col items-center justify-center gap-4 p-5">
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
