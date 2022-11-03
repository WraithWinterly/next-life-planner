import React from 'react';
import { Preloader, TailSpin } from 'react-preloader-icon';

const LoadingSpinner = () => (
  <div className='flex justify-center items-center'>
    <Preloader
      use={TailSpin}
      size={60}
      strokeWidth={6}
      strokeColor='#ffffff'
      duration={500}
    />
  </div>
);

export default LoadingSpinner;
