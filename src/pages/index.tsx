import { type NextPage } from "next";
import { api } from "@/utils/api";
import { SignInButton, useUser } from "@clerk/nextjs";
import CreatePostWizard from "@/components/create-post-wizard";
import Feed from "@/components/feed";
import PageLayout from "@/components/page-layout";

const Home: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  api.posts.getAll.useQuery();

  if (!userLoaded) {
    return <div />;
  }

  return (
    <>
      <PageLayout>
        <div className="flex border-b border-slate-400">
          {!isSignedIn && (
            <div className="flex justify-center">
              <SignInButton />
            </div>
          )}
          {isSignedIn && <CreatePostWizard />}
        </div>
        <Feed />
      </PageLayout>
    </>
  );
};

export default Home;
