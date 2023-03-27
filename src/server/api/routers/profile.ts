import { filterUserForClient } from '@/lib/helpers';
import { TRPCError } from '@trpc/server';
import { clerkClient } from '@clerk/nextjs/server';
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const profileRouter = createTRPCRouter({
  getUserByUsername: publicProcedure
    .input(z.object({ userName: z.string() }))
    .query(async ({ input }) => {
      const [user] = await clerkClient.users.getUserList({
        username: [input.userName],
      });

      if (!user) {
        const users = (
          await clerkClient.users.getUserList({
            limit: 200,
          })
        )
        const user = users.find((user) => user.externalAccounts.find((account) => account.username === input.userName));
        if (!user) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "User not found",
          });
        }
        return filterUserForClient(user)
      }

      return filterUserForClient(user);

    }),
});