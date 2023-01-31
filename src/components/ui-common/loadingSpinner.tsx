import React from 'react';
import { Preloader, TailSpin } from 'react-preloader-icon';

const LoadingSpinner = ({ size: size }: { size?: number }) => (
  <div className='flex justify-center items-center'>
    <Preloader
      use={TailSpin}
      size={size || 60}
      strokeWidth={6}
      strokeColor='#ffffff'
      duration={500}
    />
  </div>
);

export default LoadingSpinner;
