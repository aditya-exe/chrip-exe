import { type PostWithUser } from "@/types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { type MouseEvent } from "react";

dayjs.extend(relativeTime);

const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  const router = useRouter();

  function handleRouteToPost(
    e: MouseEvent<HTMLDivElement>,
    postId: string
  ): void {
    // e.preventDefault();
    e.stopPropagation();

    router.push(`/post/${postId}`).catch((err) => console.error(err));
  }

  return (
    <div
      key={post.id}
      className={
        "flex cursor-pointer items-center gap-x-4 border-b border-slate-400 p-8"
      }
      onClick={(e) => handleRouteToPost(e, post.id)}
    >
      <Image
        src={author.profileImage}
        alt={`@${author.userName}'s Profile Picture`}
        className={
          "h-14 cursor-pointer rounded-full transition-all hover:ring-2 hover:ring-slate-400"
        }
        height={56}
        width={56}
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/${author.userName}`).catch((err) => console.error(err));
        }}
      />
      <div className="flex flex-col">
        <div className="flex gap-x-2">
          <UsernameHolder userName={author.userName} />
          <div className="font-bold text-slate-400">
            {/* <Link href={`/post/${post.id}`}> */}
            <span>{` - ${dayjs(post.createdAt).fromNow()}`}</span>
            {/* </Link> */}
          </div>
        </div>
        <span className="text-2xl">{post.content}</span>
      </div>
    </div>
  );
};

export default PostView;

const UsernameHolder = ({ userName }: { userName: string }) => {
  // document.getElementById("username-link")?.addEventListener("click", (e) => {
  //   e.stopPropagation();
  // });

  return (
    <div
      className="flex cursor-pointer font-bold text-slate-400"
      id="username-link"
    >
      <Link
        href={`/@${userName}`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <span>{`@${userName} `}</span>
      </Link>
    </div>
  );
};
