import { useSession } from "next-auth/react";
import React from "react";
import { api } from "~/utils/api";
import TodoCard from "./TodoCard";

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
        <TodoCard todo={todo} key={todo.id} />
      ))}
    </div>
  );
};

export default TodoList;
