import React from 'react';
import { Preloader, TailSpin } from 'react-preloader-icon';

const LoadingSpinner = () => (
  <Preloader
    use={TailSpin}
    size={60}
    strokeWidth={6}
    strokeColor='#ffffff'
    duration={500}
  />
);

export default LoadingSpinner;
