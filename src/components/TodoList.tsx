import { useSession } from "next-auth/react";
import React from "react";
import { api } from "~/utils/api";

const TodoList = () => {
  const session = useSession();
  if (session.status !== "authenticated") return;

  return <List />;
};
const List = () => {
  const getTodos = api.todo.userList.useQuery();

  return (
    <div className="flex flex-col gap-2">
      {getTodos.data?.map((todo) => (
        <div
          className=" flex gap-3 rounded-lg border border-gray-400 p-4 text-white"
          key={todo.id}
        >
          <input type="checkbox" name="done" id="done" checked={todo.done} />
          <span>{todo.title}</span>
        </div>
      ))}
    </div>
  );
};

export default TodoList;
