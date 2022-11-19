import { SessionProvider } from 'next-auth/react';
import '@styles/globals.css';
import type { AppProps } from 'next/app';
import type { Session } from 'next-auth';
import UserContext from '../userContext/userContext';
import { useState } from 'react';

import 'react-day-picker/dist/style.css';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <SessionProvider session={session}>
      <UserContext>
        <Component {...pageProps} />
      </UserContext>
    </SessionProvider>
  );
}
