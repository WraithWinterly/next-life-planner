import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CurrentUser() {
  const [wasSigningIn, setWasSigningIn] = useState(false);
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  useEffect(() => {
    setWasSigningIn(!session);
  }, []);

  return (
    <div className=''>
      {/* Not Signed In */}
      {!session && !loading && (
        <a
          className='btn'
          onClick={(e) => {
            e.preventDefault();
            signIn();
          }}>
          Sign in
        </a>
      )}
      {!session && loading && <p className='px-4'>Signing In...</p>}
      {/* Signed In */}
      {session?.user && (
        <div
          className={`flex animate-in ${
            wasSigningIn && 'slide-in-from-left-52 slide-in-to-right'
          }`}>
          <div className='flex items-center gap-2'>
            <Link href='/profile' className='btn flex items-center gap-3 py-1'>
              {session.user.image && (
                <img
                  src={`${session.user.image}`}
                  className='w-10 h-10 object-contain rounded-3xl'
                />
              )}
              {session.user.name}
            </Link>
          </div>

          <a
            href={`/api/auth/signout`}
            className='btn'
            onClick={(e) => {
              e.preventDefault();
              signOut();
            }}>
            Sign out
          </a>
        </div>
      )}
    </div>
  );
}
