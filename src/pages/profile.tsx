import Layout from '@components/layout';
import { User } from '@prisma/client';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useUserContext } from '../userContext/userContext';

export default function ClientPage() {
  const ctx = useUserContext();
  const session = useSession();

  const user = session.data?.user as User;

  if (!ctx.signedIn && session.status != 'loading') {
    return (
      <Layout title='Dashboard'>
        <h1>You must be signed in to access this page.</h1>
        <div className='w-full flex justify-center'>
          <button
            className='btn btn-lg'
            onClick={() => {
              signIn();
            }}>
            Sign In Now
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title='Profile'>
      {!!user && (
        <div className='flex items-center flex-col gap-2 mt-2'>
          {!!user.image ? (
            <img
              src={user?.image}
              alt={'Profile'}
              className='w-32 h-32 rounded-full'
            />
          ) : (
            <p>No image</p>
          )}
          <div className='flex gap-2 text-start'>
            <div className='flex flex-col text-end'>
              <p>User ID: </p>
              <p>Username: </p>
              <p>Email: </p>
            </div>
            <div className='flex flex-col'>
              <p>{user.id}</p>
              <p>{user.name}</p>
              <p>{user.email}</p>
            </div>
          </div>
          <button
            className='btn'
            onClick={(e) => {
              e.currentTarget.disabled = true;
              signOut({ callbackUrl: '/' });
            }}>
            Sign Out
          </button>
        </div>
      )}
    </Layout>
  );
}
