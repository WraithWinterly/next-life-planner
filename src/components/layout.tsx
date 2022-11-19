import Header from './header/header';
import Footer from './footer';

interface Props {
  children: React.ReactNode;
  title: string | undefined;
}

export default function Layout({ children, title }: Props) {
  return (
    <>
      <div className='min-h-[94vh] relative'>
        <div className='pb-14'>
          <Header title={!!title ? title : undefined} />
          <main className='page-anim flex flex-col justify-center'>
            {children}
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
