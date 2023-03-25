import { PostWithUser } from "@/types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";

dayjs.extend(relativeTime);

const PostView = (props: PostWithUser) => {
  const { post, author } = props;

  return (
    <div
      key={post.id}
      className={"flex items-center gap-x-4 border-b border-slate-400 p-8"}
    >
      <Image
        src={author.profileImage}
        alt={`@${author.userName}'s Profile Picture`}
        className={"h-14 rounded-full"}
        height={56}
        width={56}
      />
      <div className="flex flex-col">
        <div className="flex font-bold text-slate-400 ">
          <span>{`@${author.userName}`}</span>
          <span>{` - ${dayjs(post.createdAt).fromNow()}`}</span>
        </div>
        <span>{post.content}</span>
      </div>
    </div>
  );
};

export default PostView;
