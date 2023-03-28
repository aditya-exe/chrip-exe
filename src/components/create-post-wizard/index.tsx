/* eslint-disable @typescript-eslint/no-misused-promises */
import { api } from "@/utils/api";
import { useClerk, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { type MouseEvent, useEffect } from "react";
import { toast } from "react-hot-toast";
import LoadingSpinner from "../loading-spinner";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  tweet: z.string().emoji().min(1),
});

type FormType = z.infer<typeof formSchema>;

const CreatePostWizard = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const ctx = api.useContext();
  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    reset,
  } = useForm<FormType>({
    resolver: zodResolver(formSchema),
  });
  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      reset();
      void ctx.posts.getAll.invalidate();
    },
  });

  useEffect(() => {
    if (errors.tweet) {
      toast.error("Only emojis allowed!");
    }
  }, [errors.tweet]);

  if (!user) {
    return null;
  }

  function handleSignOut(e: MouseEvent<HTMLImageElement>) {
    e.preventDefault();
    async function singout() {
      await signOut();
    }
    singout().catch((err) => {
      console.log(err);
    });
  }

  const onSubmit: SubmitHandler<FormType> = ({ tweet }) => {
    mutate({ content: tweet });
  };

  return (
    <div className="flex h-[100px] w-full items-center gap-3 p-4">
      <Image
        src={user.profileImageUrl}
        alt="Profile Image"
        className="h-14 w-14 rounded-full ring-1 ring-slate-400"
        height={56}
        width={56}
        onClick={handleSignOut}
      />
      <form className={"w-full"} onSubmit={hookFormSubmit(onSubmit)}>
        <div className="flex w-full grow gap-x-4">
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
    </div>
  );
};

export default CreatePostWizard;
