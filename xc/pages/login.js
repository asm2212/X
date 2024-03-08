import { getProviders, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function LoginPage({ providers }) {
  const { data, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return null; 
  }

  if (data) {
    router.push("/");
    return null; 
  }

  return (
    <div className="flex items-center justify-center h-screen">
      {Object.values(providers).map((provider) => (
        <div key={provider.id}>
          <button
            onClick={async () => {
              await signIn(provider.id);
            }}
            className="bg-twitterWhite pl-3 pr-5 py-2 text-black rounded-full flex items-center"
          >
            <img src="/google.png" alt="" className="h-8" />
            Sign in with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const providers = await getProviders();
    return {
      props: { providers },
    };
  } catch (error) {
    console.error("Error fetching providers:", error);
    return {
      props: { providers: {} }, 
    };
  }
}