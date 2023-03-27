import { api } from "@/utils/api";
import { GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "@/server/api/root";
import { prisma } from "@/server/db";
import superjson from "superjson";
import PageLayout from "@/components/page-layout";
import Image from "next/image";

const ProfilePage: NextPage<{ userName: string }> = ({ userName }) => {
  const { data } = api.profile.getUserByUserName.useQuery({
    userName,
  });

  if (!data) {
    return <div>404</div>;
  }

  return (
    <>
      <Head>
        <title>{data.userName}</title>
      </Head>

      <PageLayout>
        <div className="relative h-36 bg-slate-600">
          <Image
            src={data.profileImage}
            width={128}
            height={128}
            alt={`${data.userName}'s Profile Picture`}
            className={
              "absolute bottom-0 left-0 -mb-[64px] ml-4 rounded-full ring-1 ring-slate-400"
            }
          />
        </div>
        <div className="h-[64px]" />
        <div className="p-4 text-2xl font-bold">{`@${data.userName}`}</div>
        <div className="w-full border-b border-slate-400" />
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson,
  });

  const slug = context.params?.slug;

  if (typeof slug !== "string") {
    throw new Error("No Slug");
  }

  const userName = slug.replace("@", "");

  await ssg.profile.getUserByUserName.prefetch({ userName });

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
