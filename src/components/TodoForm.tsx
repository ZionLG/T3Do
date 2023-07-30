import React from "react";
import { useSession } from "next-auth/react";
import { api } from "../utils/api";
import { useForm, type SubmitHandler } from "react-hook-form";
import { type Todo } from "@prisma/client";
const TodoForm = () => {
  const session = useSession();
  if (session.status !== "authenticated") return;

  return <Form />;
};

type TodoInput = {
  title: string;
};

const Form = () => {
  const session = useSession();
  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm<TodoInput>();
  const utils = api.useContext();

  // Without optimistic updates
  // const { mutate, isLoading } = api.todo.create.useMutation({
  //   onSuccess: () => {
  //     resetField("title");
  //     void utils.todo.userList.invalidate();
  //   },
  // });

  // With optimistic updates
  const { mutate, isLoading } = api.todo.create.useMutation({
    async onMutate(newTodo) {
      resetField("title");
      // Cancel outgoing fetches (so they don't overwrite our optimistic update)
      await utils.todo.userList.cancel();

      // Get the data from the queryCache
      const prevData = utils.todo.userList.getData();

      const optimisticTodo = {
        title: newTodo.title,
        userId: session.data?.user?.id ?? "",
        createdAt: new Date(),
        done: false,
      } as Todo;

      // Optimistically update the data with our new post
      utils.todo.userList.setData(undefined, (old) => [
        optimisticTodo,
        ...(old ?? []),
      ]); // Use updater function

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
  if (session.status !== "authenticated") return null;
  const onSubmit: SubmitHandler<TodoInput> = (data) => {
    try {
      if (isLoading) return;
      mutate({ title: data.title });
    } catch (cause) {
      console.error({ cause }, "Failed to add post");
    }
  };

  return (
    <form
      onSubmit={(event) => void handleSubmit(onSubmit)(event)}
      className="relative block w-full before:absolute before:start-5 before:top-5 before:box-border before:block before:h-6  before:w-6 before:rounded-[50%] before:border before:border-[#393A4C]"
    >
      <input
        style={{ height: 0 }}
        {...register("title", { required: true })}
        id="title"
        className="min-h-[3rem] w-full resize-none overflow-hidden rounded-md border-none border-[#c6afe6] bg-[#25273C] py-8 pl-16 pr-5 text-lg text-[#CACDE8]
           outline-8 placeholder:text-[#777A92] "
        placeholder="Create a new todo..."
      />

      {errors.title && (
        <span className="text-red-300">This field is required</span>
      )}
    </form>
  );
};

export default TodoForm;
