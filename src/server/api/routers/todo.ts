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
      const userId = ctx.session.user.id;
      const newTodo = await ctx.prisma.todo.create({
        data: { title: todo, userId },
      });
      return newTodo;
    }),

  userList: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.todo.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { createdAt: "desc" },
    });
  }),
});
