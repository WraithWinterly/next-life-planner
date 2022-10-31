import Router from 'next/router';
import { useEffect } from 'react';

export default function Create() {
  useEffect(() => {
    Router.push('/create/day');
  }, []);
  return <></>;
}
