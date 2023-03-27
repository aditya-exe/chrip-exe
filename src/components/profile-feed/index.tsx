import { api } from "@/utils/api";
import LoadingSpinner from "../loading-spinner";
import PostView from "../post-view";

const ProfileFeed = (props: { userId: string }) => {
  const { data, isLoading } = api.posts.getPostsByUserId.useQuery({
    userId: props.userId,
  });

  if (isLoading) {
    return <LoadingSpinner size={96} />;
  }

  if (!data || data?.length === 0) {
    return <div>User has not posted</div>;
  }

  return (
    <div className="flex flex-col">
      {data.map((fullPost) => {
        return <PostView key={fullPost.post.id} {...fullPost} />;
      })}
    </div>
  );
};

export default ProfileFeed;
