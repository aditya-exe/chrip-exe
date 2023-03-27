import { type User } from "@clerk/nextjs/dist/api";

export function filterUserForClient(user: User) {
  return { id: user.id, userName: user.username, profileImage: user.profileImageUrl };
}