import Link from 'next/link';

export default function Footer() {
  return (
    <footer className='absolute bottom-0 w-full h-14'>
      <ul className='flex justify-center items-center gap-4 h-full'>
        <li className=''>
          <a
            href='https://aydens.net'
            className='text-blue-400 cursor-pointer hover:underline'>
            &copy;Ayden Springer
          </a>
        </li>
        <li className=''>
          <Link href='/policy'>
            {'2022-' + String(new Date().getFullYear())} Life Planner
          </Link>
        </li>
      </ul>
    </footer>
  );
}
