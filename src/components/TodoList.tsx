import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { api } from "~/utils/api";
import TodoCard from "./TodoCard";

const TodoList = () => {
  const session = useSession();
  if (session.status !== "authenticated") return;

  return <List />;
};
const List = () => {
  const getTodos = api.todo.userList.useQuery();
  const [todosLeft, setTodosLeft] = useState(0);

  useEffect(() => {
    if (getTodos.data) {
      setTodosLeft(getTodos.data.filter((t) => !t.done).length);
    }
  }, [getTodos.data]);

  return (
    <div>
      <ul className="rounded-t-md bg-[#25273C] ">
        {getTodos.data?.map((todo) => (
          <TodoCard todo={todo} key={todo.id} />
        ))}
      </ul>
      <div className="flex justify-between rounded-b-md bg-[#25273C] p-3 text-sm text-[#4D5066]">
        <div>{todosLeft} items left</div>
        <div className="flex gap-5">
          <span>All</span>
          <span>Active</span>
          <span>Completed</span>
        </div>
        <div>Clear Completed</div>
      </div>
    </div>
  );
};

export default TodoList;
