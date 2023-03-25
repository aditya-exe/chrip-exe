import { useUser } from "@clerk/nextjs";
import Image from "next/image";

const CreatePostWizard = () => {
  const { user } = useUser();

  if (!user) {
    return null;
  }

  return (
    <div className="flex gap-x-3 w-full">
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
        className="bg-transparent flex-grow"
      />
    </div>
  );
};

export default CreatePostWizard;
