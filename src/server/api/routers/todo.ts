import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

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
});
