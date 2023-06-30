import React, { useState } from "react";
import { useSession } from "next-auth/react";

const TodoForm = () => {
  const session = useSession();
  if (session.status !== "authenticated") return;

  return <Form />;
};

const Form = () => {
  const session = useSession();
  const [inputValue, setInputValue] = useState("");

  const createtTodo = {};

  if (session.status !== "authenticated") return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    //createtTweet.mutate({ content: inputValue });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 border-b px-4 py-2"
    >
      <div className="flex gap-4">
        <input
          style={{ height: 0 }}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-grow resize-none overflow-hidden rounded-md p-4 text-lg outline-none"
        />
      </div>
      <button className="text-white">Send</button>
    </form>
  );
};

export default TodoForm;
