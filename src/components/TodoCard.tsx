import { type Todo } from "@prisma/client";
import React from "react";
import { api } from "~/utils/api";

type TodoCardProps = {
  todo: Todo;
};

const TodoCard = ({ todo }: TodoCardProps) => {
  const utils = api.useContext();

  const { mutate: mutateStatus } = api.todo.changeDoneStatus.useMutation({
    async onMutate(newState) {
      // Cancel outgoing fetches (so they don't overwrite our optimistic update)
      await utils.todo.userList.cancel();

      // Get the data from the queryCache
      const prevData = utils.todo.userList.getData();
      if (!prevData) return;

      const optimisticTodo = JSON.parse(
        JSON.stringify(prevData.find((t) => t.id === todo.id))
      ) as Todo;

      optimisticTodo.done = newState.done;

      // Optimistically update the data with our new post
      utils.todo.userList.setData(undefined, (old) => {
        const oldTemp = [...(old ?? [])];
        const index = oldTemp.findIndex((t) => t.id === todo.id) ?? -1;
        if (index !== -1) {
          oldTemp.splice(index, 1, optimisticTodo);
        }
        return [...oldTemp];
      }); // Use updater function

      // Return the previous data so we can revert if something goes wrong
      return { prevData };
    },
    onError(err, newTodo, ctx) {
      // If the mutation fails, use the context-value from onMutate
      utils.todo.userList.setData(undefined, (old) => ctx?.prevData ?? old);
    },
    onSettled() {
      // Sync with server once mutation has settled
      void utils.todo.userList.invalidate();
    },
  });

  const { mutate: mutateDelete } = api.todo.delete.useMutation({
    async onMutate() {
      // Cancel outgoing fetches (so they don't overwrite our optimistic update)
      await utils.todo.userList.cancel();

      // Get the data from the queryCache
      const prevData = utils.todo.userList.getData();
      if (!prevData) return;

      // Optimistically update the data with our new post
      utils.todo.userList.setData(undefined, (old) => {
        const oldTemp = [...(old ?? [])];
        const index = oldTemp.findIndex((t) => t.id === todo.id) ?? -1;
        if (index !== -1) {
          oldTemp.splice(index, 1);
        }
        return [...oldTemp];
      }); // Use updater function

      // Return the previous data so we can revert if something goes wrong
      return { prevData };
    },
    onError(err, newTodo, ctx) {
      // If the mutation fails, use the context-value from onMutate
      utils.todo.userList.setData(undefined, (old) => ctx?.prevData ?? old);
    },
    onSettled() {
      // Sync with server once mutation has settled
      void utils.todo.userList.invalidate();
    },
  });
  return (
    <li className=" group flex items-center justify-center border-b border-[#393A4C] p-5 ">
      <div
        onClick={() => mutateStatus({ id: todo.id, done: !todo.done })}
        className={`mr-3 h-6 min-h-[1.5rem] min-w-[1.5rem] cursor-pointer rounded-[50%]  p-[1px]  ${
          todo.done
            ? "flex items-center justify-center bg-gradient-to-br from-[#57DDFF] to-[#C058F3] "
            : "bg-[#393A4C]  hover:bg-gradient-to-r hover:from-[#57DDFF] hover:to-[#C058F3]"
        }`}
      >
        {todo.done ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="9">
            <path
              fill="none"
              stroke="#FFF"
              stroke-width="2"
              d="M1 4.304L3.696 7l6-6"
            />
          </svg>
        ) : null}
        <div
          className={`${
            todo.done ? "hidden" : ""
          } h-full w-full rounded-[50%] bg-[#25273C]`}
        ></div>
      </div>
      <div
        onClick={() => mutateStatus({ id: todo.id, done: !todo.done })}
        className={`w-full cursor-pointer ${
          todo.done ? "text-[#4D5066] line-through" : "text-[#CACDE8]"
        } text-lg   `}
      >
        {todo.title}
      </div>
      <svg
        className="hidden cursor-pointer group-hover:block"
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        onClick={() => mutateDelete({ id: todo.id })}
      >
        <path
          fill="#494C6B"
          fill-rule="evenodd"
          d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"
        />
      </svg>
    </li>
  );
};

export default TodoCard;
