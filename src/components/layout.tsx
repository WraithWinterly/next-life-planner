import Header from './header/header';
import Footer from './footer';
import type { ReactChildren } from 'react';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <>
      <div className='min-h-[94vh] relative'>
        <div className='pb-14'>
          <Header />
          <main>{children}</main>
        </div>
      </div>
      <Footer />
    </>
  );
}
