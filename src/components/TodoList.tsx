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
  const utils = api.useContext();

  useEffect(() => {
    if (getTodos.data) {
      setTodosLeft(getTodos.data.filter((t) => !t.done).length);
    }
  }, [getTodos.data]);
  const { mutate: mutateClearCompleted } = api.todo.clearCompleted.useMutation({
    async onMutate() {
      // Cancel outgoing fetches (so they don't overwrite our optimistic update)
      await utils.todo.userList.cancel();

      // Get the data from the queryCache
      const prevData = utils.todo.userList.getData();
      if (!prevData) return;

      // Optimistically update the data with our new post
      utils.todo.userList.setData(undefined, (old) => {
        const oldTemp = [...(old ?? [])];
        let index;
        do {
          index = oldTemp.findIndex((t) => t.done) ?? -1;
          if (index !== -1) oldTemp.splice(index, 1);
        } while (index !== -1);

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
        <div className="cursor-pointer" onClick={() => mutateClearCompleted()}>
          Clear Completed
        </div>
      </div>
    </div>
  );
};

export default TodoList;
