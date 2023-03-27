import { filterUserForClient } from '@/lib/filterUserForClient';
import { TRPCError } from '@trpc/server';
import { clerkClient } from '@clerk/nextjs/server';
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const profileRouter = createTRPCRouter({
  getUserByUserName: publicProcedure
    .input(z.object({
      userName: z.string()
    }))
    .query(async ({ input }) => {
      const [user] = await clerkClient.users.getUserList({
        username: [input.userName],
      });

      if (!user) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      return filterUserForClient(user);
    })
});