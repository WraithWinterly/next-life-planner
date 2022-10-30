import Link from 'next/link';
import CurrentUser from './currentUser';

// The approach used in this component shows how to build a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.
export default function Header() {
  return (
    <header className='backdrop-blur-md bg-transparent opacity-75 px-4 py-2 border-gray-600 border-b relative z-10'>
      <nav className='h-full w-full flex justify-between items-center'>
        <CurrentUser />
        <div className='flex h-full items-center'>
          <Link href='/'>
            <button className='btn h-12'>Home</button>
          </Link>

          <Link href='/dashboard'>
            <button className='btn h-12'>Dashboard</button>
          </Link>
        </div>

        {/* <li className="">
            <Link href="/client">Client</Link>
          </li>
          <li className="">
            <Link href="/server">Server</Link>
          </li>
          <li className="">
            <Link href="/protected">Protected</Link>
          </li>
          <li className="">
            <Link href="/api-example">API</Link>
          </li>
          <li className="">
            <Link href="/admin">Admin</Link>
          </li>
          <li className="">
            <Link href="/me">Me</Link>
          </li> */}
      </nav>
    </header>
  );
}
