import LoadingScreen from '@components/ui-common/loadingScreen';
import LoadingSpinner from '@components/ui-common/loadingSpinner';
import { getProviders, signIn } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FaGithub } from 'react-icons/fa';

export default function SignIn({ providers }: any) {
  const router = useRouter();

  const [signingIn, setSigningIn] = useState(false);

  return (
    <div className='min-h-screen relative flex flex-col from-slate-900 to-zinc-800 bg-gradient-to-br px-2'>
      <section className='text-center max-w-[600px] mx-auto'>
        <h1>Daily Planner</h1>
        <div className='from-slate-800 to-slate-900 bg-gradient-to-r rounded-lg px-8 mt-2 pb-8 pt-2 flex-col'>
          <div className='flex flex-col items-center mr-4'>
            <h1 className=''>Sign In to Continue</h1>
            {!!providers ? (
              Object.values(providers).map((provider: any) => (
                <button
                  key={provider.name}
                  className='flex btn btn-lg justify-start items-center gap-3'
                  onClick={() => {
                    setSigningIn(true);
                    signIn(provider.id, {
                      callbackUrl: process.env
                        .NEXT_PUBLIC_NEXTAUTH_URL as string,
                    });
                  }}>
                  {provider.name == 'GitHub' && <FaGithub></FaGithub>}
                  <div className='pb-[2px]'>Sign in with {provider.name}</div>
                </button>
              ))
            ) : (
              <h3>
                There are no sign-in providers. The Next Auth API Server is not
                working as expected.
              </h3>
            )}
          </div>
          <Image
            src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg'
            className='h-80 py-6'
            width={400}
            height={400}
            alt='Sign In'
          />
        </div>
      </section>
      {signingIn && <LoadingScreen text='Signing In' />}
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}
