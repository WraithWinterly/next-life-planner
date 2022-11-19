import { useSession } from 'next-auth/react';
import Link from 'next/link';
import CurrentUser from './currentUser';
import { HomeIcon, ChartBarSquareIcon } from '@heroicons/react/24/outline';
import { useUserContext } from '@/src/userContext/userContext';

interface HeaderProps {
  title: string | undefined;
}
export default function Header({ title }: HeaderProps) {
  const ctx = useUserContext();

  const session = useSession();
  return (
    <header className='backdrop-blur-md bg-opacity-75 px-4 py-2 border-gray-600 border-b relative z-10'>
      <nav className='h-full w-full flex justify-between items-center'>
        <CurrentUser />
        <h1 className='abs-center'>{!!title ? title : ''}</h1>
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
            <Link href='/dashboard'>
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
