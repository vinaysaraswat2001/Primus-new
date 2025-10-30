import React, { useEffect, useState } from 'react';
import loader from '../../assets/loader.webp';

const StartAnimation = () => {
  const [animationClass, setAnimationClass] = useState('animate__zoomIn');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimationClass('animate__zoomOut');
    }, 4000); // Trigger zoomOut after 4 seconds

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="h-screen w-screen bg-[#441410] flex justify-center items-center">
      <img
        src={loader}
        alt="Logo"
        loading="lazy"
        className={`animate__animated ${animationClass} max-w-[80vw] max-h-[80vh] object-contain`}
      />
    </div>
  );
};

export default StartAnimation;