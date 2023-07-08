import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "../utils/api";
const TodoForm = () => {
  const session = useSession();
  if (session.status !== "authenticated") return;

  return <Form />;
};

const Form = () => {
  const session = useSession();
  const [inputValue, setInputValue] = useState("");
  const utils = api.useContext();

  const createtTodo = api.todo.addTodo.useMutation({});
  if (session.status !== "authenticated") return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    //createtTweet.mutate({ content: inputValue });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className=" flex w-full justify-center gap-2 px-4 py-2"
    >
      <input
        style={{ height: 0 }}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="max-w-3xl flex-grow resize-none overflow-hidden  rounded-md bg-gradient-to-b from-[#500ead] to-[#0e147c]  
           px-5 py-6 text-lg text-[#c6afe6] outline-none"
        placeholder="What do you have planned?"
      />
      <button className="font-bold text-white">Add task</button>
    </form>
  );
};

export default TodoForm;
