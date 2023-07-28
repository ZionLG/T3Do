import { type Todo } from "@prisma/client";
import React from "react";
import { api } from "~/utils/api";

type TodoCardProps = {
  todo: Todo;
};

const TodoCard = ({ todo }: TodoCardProps) => {
  const utils = api.useContext();

  //   const { mutate, isLoading } = api.todo.changeDoneStatus.useMutation({
  //     onSuccess: () => {
  //       void utils.todo.userList.invalidate();
  //     },
  //   });

  const { mutate } = api.todo.changeDoneStatus.useMutation({
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
        onChange={(e) => mutate({ id: todo.id, done: e.target.checked })}
      />
      <span>{todo.title}</span>
    </div>
  );
};

export default TodoCard;
