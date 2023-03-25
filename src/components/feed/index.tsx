import { api } from "@/utils/api";
import LoadingSpinner from "../loading-spinner";
import PostView from "../post-view";

const Feed = () => {
  const { data: postsData, isLoading: postsLoading } =
    api.posts.getAll.useQuery();

  if (postsLoading) {
    return <LoadingSpinner />;
  }

  if (!postsData) {
    return <div>Something went wrong</div>;
  }

  return (
    <div className="flex flex-col">
      {[...postsData, ...postsData]?.map((fullPost) => {
        return <PostView key={fullPost.post.id} {...fullPost} />;
      })}
    </div>
  );
};

export default Feed;
