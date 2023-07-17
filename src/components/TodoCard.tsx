import { type Todo } from "@prisma/client";
import React from "react";
import { api } from "~/utils/api";

type TodoCardProps = {
  todo: Todo;
};

const TodoCard = ({ todo }: TodoCardProps) => {
  const utils = api.useContext();

  const { mutate, isLoading } = api.todo.changeDoneStatus.useMutation({
    onSuccess: () => {
      void utils.todo.userList.invalidate();
    },
  });
  return (
    <div
      className=" flex gap-3 rounded-lg border border-gray-400 p-4 text-white"
      key={todo.id}
    >
      <input
        type="checkbox"
        name="done"
        id="done"
        checked={todo.done}
        disabled={isLoading}
        onChange={(e) => mutate({ id: todo.id, done: e.target.checked })}
      />
      <span>{todo.title}</span>
    </div>
  );
};

export default TodoCard;
