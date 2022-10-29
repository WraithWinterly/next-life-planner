import React from 'react';
import LoadingSpinner from './loadingSpinner';

interface LoadingScreenProps {
  text: string;
}

function LoadingScreen({ text }: LoadingScreenProps) {
  return (
    <div
      className='
      fixed top-0 bottom-0 left-0 right-0 pb-8 bg-slate-900 opacity-75
      flex flex-col justify-center items-center animate-in fade-in
      duration-500'>
      <LoadingSpinner />

      <h2>{text}...</h2>
    </div>
  );
}

export default LoadingScreen;
