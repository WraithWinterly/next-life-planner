import LoadingScreen from '@/src/components/ui-common/loadingScreen';
import LoadingSpinner from '@/src/components/ui-common/loadingSpinner';
import { getProviders, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FaGithub } from 'react-icons/fa';

export default function SignIn({ providers }: any) {
  const router = useRouter();

  const [signingIn, setSigningIn] = useState(false);

  return (
    <div className='min-h-screen relative flex flex-col'>
      <section className='text-center fixed-center'>
        <h1>Daily Planner</h1>
        <div className='from-slate-800 to-slate-900 bg-gradient-to-r rounded-lg px-8 mt-2 py-8 flex'>
          <img
            src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg'
            className='h-80'
          />
          <div className='flex flex-col items-center mr-4'>
            <h1 className=''>Sign In to Continue</h1>
            {Object.values(providers).map((provider: any) => (
              <button
                key={provider.name}
                className='flex btn btn-lg justify-start items-center gap-3'
                onClick={() => {
                  setSigningIn(true);
                  signIn(provider.id, {
                    callbackUrl: router.query.callbackUrl as string,
                  });
                }}>
                {provider.name == 'GitHub' && <FaGithub></FaGithub>}
                <div className='pb-[2px]'>Sign in with {provider.name}</div>
              </button>
            ))}
          </div>
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
