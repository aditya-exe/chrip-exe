import superjson from 'superjson';
import { appRouter } from './../server/api/root';
import { clerkClient, type User } from "@clerk/nextjs/dist/api";
import { type Post } from "@prisma/client";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { TRPCError } from "@trpc/server";
import { prisma } from '@/server/db';

export function filterUserForClient(user: User) {
  return {
    id: user.id,
    userName: user.username,
    profileImage: user.profileImageUrl,
    externalUsername: user.externalAccounts.find((externalAccount) => externalAccount.provider === "oauth_github")?.username || null
  };
}

export async function addUserDataToPosts(posts: Post[]) {
  const userIds = posts.map((post) => post.authorId);
  const users = (
    await clerkClient.users.getUserList({
      userId: userIds,
      limit: 110,
    })
  ).map(filterUserForClient);

  return posts.map((post) => {

    const author = users.find((user) => user.id === post.authorId);

    if (!author) {
      console.error("AUTHOR NOT FOUND", post);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Author for post not found. POST ID: ${post.id}, USER ID: ${post.authorId}`,
      });
    }
    if (!author.userName) {
      // user the ExternalUsername
      if (!author.externalUsername) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Author has no GitHub Account: ${author.id}`,
        });
      }
      author.userName = author.externalUsername;
    }
    return {
      post,
      author: {
        ...author,
        userName: author.userName ?? "(username not found)",
      },
    };
  });
}

export function generateSSGHelper() {
  return createProxySSGHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson
  });
}