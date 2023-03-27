import LoadingSpinner from "@/components/loading-spinner";
import PageLayout from "@/components/page-layout";
import PostView from "@/components/post-view";
import { generateSSGHelper } from "@/lib/helpers";
import { api } from "@/utils/api";
import { type GetStaticProps, type NextPage } from "next";
import Head from "next/head";

const SinglePostPage: NextPage<{ postId: string }> = ({ postId }) => {
  const { data, isLoading } = api.posts.getById.useQuery({ postId });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!data) {
    return <div>404</div>;
  }

  return (
    <>
      <Head>
        <title>{`${data.post.content} - @${data.author.userName}`}</title>
      </Head>

      <PageLayout>
        <PostView {...data} />
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const id = context.params?.id;

  if (typeof id !== "string") {
    throw new Error("No ID");
  }

  await ssg.posts.getById.prefetch({ postId: id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      postId: id,
    },
  };
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default SinglePostPage;
