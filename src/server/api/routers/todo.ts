import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const todoRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ title: z.string() }))
    .mutation(async ({ input: { title }, ctx }) => {
      const userId = ctx.session.user.id;
      const newTodo = await ctx.prisma.todo.create({
        data: { title, userId },
      });
      return newTodo;
    }),

  userList: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.todo.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { createdAt: "desc" },
    });
  }),

  changeDoneStatus: protectedProcedure
    .input(z.object({ id: z.string(), done: z.boolean() }))
    .mutation(async ({ input: { id, done }, ctx }) => {
      const updatedTodo = await ctx.prisma.todo.update({
        data: { done },
        where: { id },
      });

      return updatedTodo;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input: { id }, ctx }) => {
      const updatedTodo = await ctx.prisma.todo.delete({
        where: { id },
      });

      return updatedTodo;
    }),
  clearCompleted: protectedProcedure.mutation(async ({ ctx }) => {
    const updatedTodo = await ctx.prisma.todo.deleteMany({
      where: { done: true, userId: ctx.session.user.id },
    });

    return updatedTodo;
  }),
});
