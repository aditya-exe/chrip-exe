import { privateProcedure } from './../trpc';
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import { addUserDataToPosts } from '@/lib/helpers';

const rateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
});

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure
    .query(async ({ ctx }) => {
      const posts = await ctx.prisma.post.findMany({
        take: 100,
        orderBy: [
          {
            createdAt: "desc"
          }
        ]
      });

      return addUserDataToPosts(posts);
    }),
  create: privateProcedure
    .input(z.object({
      content: z.string().emoji("Only emojis allowed").min(1).max(280),
    }))
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;

      const { success } = await rateLimit.limit(authorId);

      if (!success) {
        throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
      }

      const post = await ctx.prisma.post.create({
        data: {
          authorId,
          content: input.content,
        }
      });

      return post;
    }),
  getPostsByUserId: publicProcedure
    .input(z.object({
      userId: z.string()
    }))
    .query(({ ctx, input }) => ctx.prisma.post.findMany({
      where: {
        authorId: input.userId
      },
      take: 100,
      orderBy: [{ createdAt: "desc" }]
    }).then(addUserDataToPosts)
    ),
  getById: publicProcedure
    .input(z.object({
      postId: z.string()
    }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: {
          id: input.postId
        }
      });

      if (!post) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return (await addUserDataToPosts([post]))[0];
    })
});