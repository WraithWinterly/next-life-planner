import {
  SessionContext,
  SessionContextValue,
  SessionProvider,
  useSession,
} from 'next-auth/react';
import '@styles/globals.css';
import type { AppProps } from 'next/app';
import type { Session } from 'next-auth';
import UserContext from '../userContext/userContext';
import { useState } from 'react';

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
