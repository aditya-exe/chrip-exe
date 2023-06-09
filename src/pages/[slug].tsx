import { api } from "@/utils/api";
import { type GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import PageLayout from "@/components/page-layout";
import Image from "next/image";
import ProfileFeed from "@/components/profile-feed";
import { generateSSGHelper } from "@/lib/helpers";

const ProfilePage: NextPage<{ userName: string }> = ({ userName }) => {
  const { data } = api.profile.getUserByUsername.useQuery({
    userName,
  });

  if (!data) {
    return <div>404</div>;
  }

  return (
    <>
      <Head>
        <title>{data.userName ?? data.externalUsername}</title>
      </Head>

      <PageLayout>
        <div className="relative h-36 bg-slate-600">
          <Image
            src={data.profileImage}
            alt={`${userName}'s profile pic`}
            width={128}
            height={128}
            className="absolute bottom-0 left-0 -mb-[64px] ml-4 rounded-full border-4 border-black bg-black"
          />
        </div>
        <div className="h-[64px]" />
        <div className="p-4 text-2xl font-bold">{`@${userName}`}</div>
        <div className="w-full border-b border-slate-400" />
        <div className="h-fit">
          <ProfileFeed userId={data.id} />
        </div>
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const slug = context.params?.slug;

  if (typeof slug !== "string") {
    throw new Error("No Slug");
  }

  const userName = slug.replace("@", "");

  await ssg.profile.getUserByUsername.prefetch({ userName });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      userName,
    },
  };
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default ProfilePage;
