import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { api } from "~/utils/api";
import TodoCard from "./TodoCard";

const TodoList = () => {
  const session = useSession();
  if (session.status !== "authenticated") return;

  return <List />;
};

type todoFilter = "all" | "active" | "completed";

const List = () => {
  const getTodos = api.todo.userList.useQuery();
  const [todosLeft, setTodosLeft] = useState(0);
  const [filter, setFilter] = useState<todoFilter>("all");
  const [filteredTodos, setFilteredTodos] = useState(
    [] as typeof getTodos.data
  );
  const utils = api.useContext();

  useEffect(() => {
    if (getTodos.data) {
      switch (filter) {
        case "all":
          setFilteredTodos(getTodos.data);
          break;
        case "active":
          setFilteredTodos(getTodos.data.filter((t) => !t.done));
          break;
        case "completed":
          setFilteredTodos(getTodos.data.filter((t) => t.done));
          break;
      }
    }
  }, [filter, getTodos.data]);
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

  const filterHtml = (
    <>
      <span
        className={`cursor-pointer ${
          filter === "all" ? "text-[#3A7BFD]" : " hover:text-[#CACDE8]"
        }`}
        onClick={() => setFilter("all")}
      >
        All
      </span>
      <span
        className={`cursor-pointer ${
          filter === "active" ? "text-[#3A7BFD]" : " hover:text-[#CACDE8]"
        }`}
        onClick={() => setFilter("active")}
      >
        Active
      </span>
      <span
        className={`cursor-pointer ${
          filter === "completed" ? "text-[#3A7BFD]" : " hover:text-[#CACDE8]"
        }`}
        onClick={() => setFilter("completed")}
      >
        Completed
      </span>
    </>
  );
  return (
    <div>
      <ul className="rounded-t-md bg-[#25273C] ">
        {filteredTodos?.map((todo) => (
          <TodoCard todo={todo} key={todo.id} />
        ))}
      </ul>
      <div className=" flex justify-between rounded-b-md bg-[#25273C] p-3 text-lg text-[#4D5066] sm:text-sm">
        <div>{todosLeft} items left</div>
        <div className="hidden gap-5 sm:flex">{filterHtml}</div>
        <div
          className={`cursor-pointer text-lg hover:text-[#CACDE8] sm:text-sm`}
          onClick={() => mutateClearCompleted()}
        >
          Clear Completed
        </div>
      </div>
      <div className="mt-5 flex justify-center gap-5 rounded-md bg-[#25273C] p-3 text-lg font-bold text-[#4D5066] sm:hidden">
        {filterHtml}
      </div>
    </div>
  );
};

export default TodoList;
