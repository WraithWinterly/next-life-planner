import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        {/* <link
          rel="stylesheet"
          href="..."
        /> */}
      </Head>
      <body className='h-full min-h-screen text-gray-200 text-center mx-auto'>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
