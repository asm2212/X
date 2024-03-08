import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function useUserInfo() {
  const { data: session, status: sessionStatus } = useSession();
  const [userInfo, setUserInfo] = useState(null);
  const [status, setStatus] = useState('loading');

  async function getUserInfo() {
    if (sessionStatus === 'loading') {
      return;
    }

    if (sessionStatus === 'unauthenticated') {
      setStatus('unauthenticated');
      return;
    }

    try {
      const response = await fetch('/api/users?id=' + session.user.id);
      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }
      const json = await response.json();
      setUserInfo(json.user);
      setStatus('authenticated');
    } catch (error) {
      console.error('Error fetching user info:', error);
   
    }
  }

  useEffect(() => {
    getUserInfo();
  }, [sessionStatus]);

  return { userInfo, setUserInfo, status };
}