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
      <body className='from-slate-700 to-slate-900 bg-gradient-to-tr text-gray-200 text-center mx-auto transition-none delay-500'>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
