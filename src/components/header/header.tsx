import { useSession } from 'next-auth/react';
import Link from 'next/link';
import CurrentUser from './currentUser';
import { HomeIcon, ChartBarSquareIcon } from '@heroicons/react/24/outline';
import { useUserContext } from '@/src/userContext/userContext';
import { useRouter } from 'next/router';

interface HeaderProps {
  title: string | undefined;
}
export default function Header({ title }: HeaderProps) {
  const session = useSession();
  const router = useRouter();
  return (
    <header className='backdrop-blur-md bg-opacity-75 px-2 py-2 w-full relative z-10'>
      <nav className='h-full w-full flex flex-col items-center'>
        <div className='flex w-full justify-between '>
          <CurrentUser />
          <h1 className='abs-center hidden md:block'>{!!title ? title : ''}</h1>
          <div className='flex h-full items-center'>
            <Link href='/'>
              <button
                className={`btn h-12 gap-3 ${
                  router.pathname === '/' && 'bg-green-700 hover:bg-green-600'
                }`}>
                <div className='tw-btn-icon'>
                  <HomeIcon aria-hidden='false' className='w-8' />
                </div>
                <div className='hidden md:block'>Home</div>
              </button>
            </Link>

            {!!session.data && (
              <Link href='/dashboard'>
                <button
                  className={`btn h-12 gap-3 ${
                    router.pathname === '/dashboard' &&
                    'bg-green-700 hover:bg-green-600'
                  }`}>
                  <div className='tw-btn-icon'>
                    <ChartBarSquareIcon aria-hidden='false' className='w-8' />
                  </div>
                  <div className='hidden md:block'>Dashboard</div>
                </button>
              </Link>
            )}
          </div>
        </div>
        <div>
          <h1 className='md:hidden'>{!!title ? title : ''}</h1>
        </div>
      </nav>
    </header>
  );
}
