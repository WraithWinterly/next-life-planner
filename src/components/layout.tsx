import Header from './header/header';
import Footer from './footer';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <>
      <div className='min-h-[94vh] relative'>
        <div className='pb-14'>
          <Header />
          <main className='page-anim flex flex-col justify-center'>
            {children}
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
