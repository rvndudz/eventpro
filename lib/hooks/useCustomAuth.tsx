import { auth } from "@clerk/nextjs/server";
import { useEffect, useState } from "react";

export const useCustomAuth = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuth = async () => {
      const authResult = auth();
      setUserId(authResult.sessionClaims?.userId || null);
    };

    fetchAuth();
  }, []);

  return userId;
};
