import { api } from "@/utils/api";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useState } from "react";

const CreatePostWizard = () => {
  const { user } = useUser();
  const ctx = api.useContext();
  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
    },
  });
  const [input, setInput] = useState("");

  if (!user) {
    return null;
  }

  return (
    <div className="flex w-full gap-x-3">
      <Image
        src={user.profileImageUrl}
        alt="Profile Image"
        className="h-14 w-14 rounded-full"
        height={56}
        width={56}
      />
      <input
        type="text"
        name="emoji-input"
        id="emoji-input"
        placeholder="Type some emojis!"
        className="flex-grow bg-transparent"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={isPosting}
      />
      <button onClick={(e) => mutate({ content: input })}>Post</button>
    </div>
  );
};

export default CreatePostWizard;
