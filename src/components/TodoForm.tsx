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

  // const { mutate, isLoading } = api.todo.create.useMutation({
  //   onSuccess: () => {
  //     resetField("title");
  //     void utils.todo.userList.invalidate();
  //   },
  // });

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
      mutate({ title: data.title });
    } catch (cause) {
      console.error({ cause }, "Failed to add post");
    }
  };

  return (
    <form
      onSubmit={(event) => void handleSubmit(onSubmit)(event)}
      className=" flex w-full justify-center gap-2 px-4 py-2"
    >
      <input
        style={{ height: 0 }}
        {...register("title", { required: true })}
        id="title"
        className="max-w-3xl flex-grow resize-none overflow-hidden  rounded-md bg-gradient-to-b from-[#5a5a5a] to-[#2c2c2c]  
           px-5 py-6 text-lg text-[#c6afe6] outline-none"
        placeholder="What do you have planned?"
      />
      {errors.title && <span>This field is required</span>}

      <button
        disabled={isLoading}
        type="submit"
        className="font-bold text-white"
      >
        Add task
      </button>
    </form>
  );
};

export default TodoForm;
