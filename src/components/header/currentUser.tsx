import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { Popover, Transition } from '@headlessui/react';
import {
  ChevronDownIcon,
  UserCircleIcon,
  ChevronDoubleLeftIcon,
} from '@heroicons/react/20/solid';
import { Fragment } from 'react';
import LoadingScreen from '../ui-common/loadingScreen';
import LoadingSpinner from '../ui-common/loadingSpinner';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';

interface MenuOptions {
  name: string;
  action: () => void;
  icon: any;
}

export default function CurrentUser() {
  const [wasSigningIn, setWasSigningIn] = useState(false);
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const [loadingSignInOrOut, setLoadingSignInOrOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setWasSigningIn(!session);
  }, []);

  const menuOptions: MenuOptions[] = [
    {
      name: 'My Profile',
      action: () => Router.push('/profile'),
      icon: UserCircleIcon,
    },
    {
      name: 'Sign Out',
      action: () => {
        setLoadingSignInOrOut(true);
        signOut({ callbackUrl: '/' });
      },
      icon: ChevronDoubleLeftIcon,
    },
  ];

  return (
    <>
      {loadingSignInOrOut && <LoadingScreen text='Redirecting' />}
      <div className='w-full max-w-sm px-0 relative'>
        {!session && loading && (
          <a className='btn w-32 h-12'>
            <LoadingSpinner size={32} />
          </a>
        )}
        {!session && !loading && (
          <a
            onClick={(e) => {
              e.preventDefault();
              setLoadingSignInOrOut(true);
              signIn();
            }}>
            <button className='btn h-12 gap-3'>
              <ArrowLeftOnRectangleIcon className='w-8' />
              <span>Sign In</span>
            </button>
          </a>
        )}
        {session && (
          <Popover
            className={`animate-in ${
              wasSigningIn && 'slide-in-from-left-52 slide-in-to-right'
            }`}>
            {({ open }) => (
              <>
                <Popover.Button
                  className={`
                ${open ? ' bg-indigo-800' : 'text-opacity-90'}
                btn ${
                  router.pathname === '/profile'
                    ? 'bg-green-700 hover:bg-green-600'
                    : ''
                }`}>
                  {session.user.image && (
                    <img
                      src={`${session.user.image}`}
                      className='w-10 h-10 object-contain rounded-3xl md:mr-4'
                    />
                  )}
                  <span className='hidden md:block'>{session.user.name}</span>
                  <ChevronDownIcon
                    className={`${open ? '' : 'text-opacity-80'}
                  ml-2 h-5 w-5 text-white transition duration-150 ease-in-out group-hover:text-opacity-80`}
                    aria-hidden='true'
                  />
                </Popover.Button>
                <Transition
                  as={Fragment}
                  enter='transition ease-out duration-200'
                  enterFrom='opacity-0 translate-y-1'
                  enterTo='opacity-100 translate-y-0'
                  leave='transition ease-in duration-150'
                  leaveFrom='opacity-100 translate-y-0'
                  leaveTo='opacity-0 translate-y-1'>
                  <Popover.Panel className='absolute transform px-4 sm:px-0 lg:max-w-3xl w-64 text-white'>
                    <div className='overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5'>
                      <div className='relative grid gap-8 from-slate-800 to-zinc-800 bg-gradient-to-br p-7 lg:grid-cols-1'>
                        {menuOptions.map((item) => (
                          <button
                            key={item.name}
                            onClick={item.action}
                            className='-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-700 focus:outline-none focus-visible:ring focus-visible:ring-slate-500 focus-visible:ring-opacity-50'>
                            <div className='flex h-10 w-10 shrink-0 items-center justify-center text-white sm:h-12 sm:w-12'>
                              <item.icon aria-hidden='true' className='w-16' />
                            </div>
                            <div className='ml-4'>
                              <p className='text-sm font-medium text-gray-300'>
                                {item.name}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </Popover.Panel>
                </Transition>
              </>
            )}
          </Popover>
        )}
      </div>
    </>
  );
}
