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
            <div className="flex w-full items-center justify-center gap-x-4 p-4">
              <div className="rounded border-2 border-slate-600 bg-slate-400 p-2 text-white">
                <SignInButton />
              </div>
              <span className="font-bold text-xl">Sign In to send emojis!</span>
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
