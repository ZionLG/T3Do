import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const todoRouter = createTRPCRouter({
  addTodo: protectedProcedure
    .input(z.object({ todo: z.string() }))
    .mutation(async ({ input: { todo }, ctx }) => {
      const newTodo = await ctx.prisma.todo.create({ data: { title: todo } });
      return newTodo;
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.todo.findMany();
  }),
});
