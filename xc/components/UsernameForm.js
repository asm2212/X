import { useEffect, useState } from "react";
import useUserInfo from "../hooks/useUserInfo";
import { useRouter } from "next/router";

export default function UsernameForm() {
  const { userInfo, status } = useUserInfo();
  const [username, setUsername] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') {
      return;
    }


    const defaultUsername = userInfo?.email?.split('@')[0]?.replace(/[^a-z]+/gi, '');
    setUsername(defaultUsername || '');
  }, [status])

  async function handleFormSubmit(e) {
    e.preventDefault();
    
    try {
      await fetch('/api/users', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      router.reload();
    } catch (error) {
      console.error('Error submitting username:', error);
    }
  }

  if (status === 'loading') {
    return null;
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <form className="text-center" onSubmit={handleFormSubmit}>
        <h1 className="text-xl mb-2">Pick a Username</h1>
        <input type="text" className="block mb-1 bg-xborder px-3 py-1 rounded-full" placeholder="username" value={username} onChange={e => setUsername(e.target.value)} />
        <button className="block bg-xblue w-full rounded-full py-1" type="submit">Continue</button>
      </form>
    </div>
  );
}