import { useSession } from 'next-auth/react';
import Link from 'next/link';
import CurrentUser from './currentUser';
import { HomeIcon, ChartBarSquareIcon } from '@heroicons/react/24/outline';
import { useUserContext } from '@/src/userContext/userContext';

// The approach used in this component shows how to build a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.

export default function Header() {
  const ctx = useUserContext();

  const session = useSession();
  return (
    <header className='backdrop-blur-md bg-transparent opacity-75 px-4 py-2 border-gray-600 border-b relative z-10'>
      <nav className='h-full w-full flex justify-between items-center'>
        <CurrentUser />
        <div className='flex h-full items-center'>
          <Link href='/'>
            <button className='btn h-12 gap-3'>
              <div className='tw-btn-icon'>
                <HomeIcon aria-hidden='false' />
              </div>
              Home
            </button>
          </Link>

          {!!session.data && (
            <Link href='/dashboard' onClick={() => ctx.setRefetch(true)}>
              <button className='btn h-12 gap-3'>
                <div className='tw-btn-icon'>
                  <ChartBarSquareIcon aria-hidden='false' />
                </div>
                Dashboard
              </button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
