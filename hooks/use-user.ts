import { getUser } from "@/actions/user.actions";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
interface User {
  _id: string;
  clerkId: string;
  email: string;
  fullName: string;
  picture: string;
  isAdmin: boolean;
}
const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const { userId } = useAuth();

  useEffect(() => {
    const getData = async () => {
      try {
        if (userId) {
          const data = await getUser(userId!);
          setUser(data);
        }
      } catch (error) {
        setUser(null);
      }
    };

    if (userId) getData();
  }, [userId]);
  if (!userId) {
    return { user: null };
  }
  return { user };
};

export default useUser;
