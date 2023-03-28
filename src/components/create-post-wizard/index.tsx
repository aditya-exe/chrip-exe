/* eslint-disable @typescript-eslint/no-misused-promises */
import { api } from "@/utils/api";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import LoadingSpinner from "../loading-spinner";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SignOutMenu from "../sign-out-menu";
import { useRouter } from "next/router";

const formSchema = z.object({
  tweet: z.string().emoji().min(1),
});

type FormType = z.infer<typeof formSchema>;

const CreatePostWizard = () => {
  const { user: userFromClerk } = useUser();
  const router = useRouter();
  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    reset,
  } = useForm<FormType>({
    resolver: zodResolver(formSchema),
  });
  useEffect(() => {
    if (errors.tweet) {
      toast.error("Only emojis allowed!");
    }
  }, [errors.tweet]);

  if (!userFromClerk) {
    return null;
  }

  const user = {
    id: userFromClerk.id,
    userName: userFromClerk.username,
    profileImage: userFromClerk.profileImageUrl,
    externalUsername:
      userFromClerk.externalAccounts.find(
        (externalAccount) =>
          (externalAccount.provider as string) === "oauth_github"
      )?.username || null,
  };

  const userName =
    user.userName ?? user.externalUsername ?? "Username not found";

  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      reset();
      void ctx.posts.getAll.invalidate();
    },
  });

  const onSubmit: SubmitHandler<FormType> = ({ tweet }) => {
    mutate({ content: tweet });
  };

  return (
    <div className="flex h-[100px] w-full items-center gap-x-3 p-4">
      <Image
        src={user.profileImage}
        alt="Profile Image"
        className="h-14 w-14 cursor-pointer rounded-full ring-1 ring-slate-400"
        height={56}
        width={56}
        onClick={async () => {
          await router.push(`/${userName}`);
        }}
      />
      <form className={"w-full"} onSubmit={hookFormSubmit(onSubmit)}>
        <div className="flex gap-x-4">
          <input
            {...register("tweet")}
            type="text"
            placeholder="Type some emojis!"
            className="grow rounded border-2 border-slate-400 bg-transparent p-2 outline-none"
            disabled={isPosting}
          />
          {!isPosting && (
            <button
              className={"min-w-[100px] rounded border-2 border-slate-400 p-2"}
              type="submit"
            >
              Post
            </button>
          )}
        </div>
      </form>
      {isPosting && (
        <div className="flex items-center justify-center">
          <LoadingSpinner size={45} />
        </div>
      )}

      <SignOutMenu userName={userName} />
    </div>
  );
};

export default CreatePostWizard;
