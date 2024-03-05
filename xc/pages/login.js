import { signIn, getProviders } from 'next-auth/react';
import "../public/google.png"

export default function LoginPage({ providers }) {
    return (
        <div className="flex items-center justify-center h-screen">
            {providers && Object.values(providers).map(provider => (
                <div key={provider.id}>
                    <button onClick={async() => {await signIn(provider.id)}} className="bg-xwhite px-5 py-2 text-black 
                    rounded-full flex items-center"
                    > <img src= "./google.png" alt= ""
                    className="h-8"/>
                        Sign in with {provider.name}</button>
                </div>
            ))}
        </div>
    );
}

export async function getServerSideProps() {
    const providers = await getProviders();
    return {
        props: {
            providers
        },
    };
}
