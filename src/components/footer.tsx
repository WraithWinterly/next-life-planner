import Link from 'next/link';

export default function Footer() {
  return (
    <footer className='border-gray-600 border-t aboslute bottom-0 w-full h-14'>
      <ul className='flex justify-center items-center gap-4 h-full'>
        <li className=''>
          <a href='https://next-auth.js.org'>&copy; WraithWinterly</a>
        </li>
        <li className=''>
          <Link href='/policy'>{new Date().getFullYear()} Life Planner</Link>
        </li>
      </ul>
    </footer>
  );
}
