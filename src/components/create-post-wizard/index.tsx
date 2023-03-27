import { api } from "@/utils/api";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-hot-toast";
import LoadingSpinner from "../loading-spinner";

const CreatePostWizard = () => {
  const { user } = useUser();
  const ctx = api.useContext();
  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
    },
    onError: (error) => {
      const errorMessage = error.data?.zodError?.fieldErrors.content;

      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to post! Please try again later");
      }
    },
  });
  const [input, setInput] = useState("");

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-[100px] p-4 w-full items-center gap-3">
      <Image
        src={user.profileImageUrl}
        alt="Profile Image"
        className="h-14 w-14 rounded-full ring-1 ring-slate-400"
        height={56}
        width={56}
      />
      <input
        type="text"
        name="emoji-input"
        id="emoji-input"
        placeholder="Type some emojis!"
        className="flex-grow bg-transparent p-2 outline-slate-400"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          e.preventDefault();
          if (input !== "") {
            mutate({ content: input } );
          }
        }}
        disabled={isPosting}
      />
      {input !== "" && !isPosting && (
        <button
          onClick={(e) => mutate({ content: input })}
          className={"min-w-[100px] rounded border-2 border-slate-400 p-2"}
        >
          Post
        </button>
      )}
      {isPosting && (
        <div className="flex items-center justify-center">
          <LoadingSpinner size={45} />
        </div>
      )}
    </div>
  );
};

export default CreatePostWizard;
