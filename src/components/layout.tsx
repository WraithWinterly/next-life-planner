import Header from './header/header';
import Footer from './footer';

interface Props {
  children: React.ReactNode;
  title: string | undefined;
}

export default function Layout({ children, title }: Props) {
  return (
    <>
      <div className='from-slate-900 to-zinc-800 h-full min-h-screen bg-gradient-to-br relative'>
        <div className='pb-14'>
          <Header title={!!title ? title : undefined} />
          <main className='page-anim flex flex-col justify-center'>
            {children}
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
}
