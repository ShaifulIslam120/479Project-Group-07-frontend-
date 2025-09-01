import React from 'react';
import { Link } from 'react-router-dom';
import banner from '../assets/13589460_MjgxNzM5Mjcz.jpg';

const Welcome = () => {
  return (
    <div className="relative w-[80%] ml-[20%] h-screen overflow-hidden">
      {/* Banner Image with subtle zoom animation */}
      <img 
        src={banner} 
        alt="LearnSpace Banner" 
        className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
      />
      
      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-black/30">
        {/* Animated Title */}
        <h1 className="text-5xl font-bold text-white mb-8 animate-fadeIn">
          Welcome to LearnSpace
        </h1>
        
        {/* Buttons Container */}
        <div className="flex gap-6">
          {/* SignIn Button */}
          <Link 
            to="/signin" 
            className="btn btn-primary px-8 text-lg h-14
                      transform transition-all duration-300 
                      hover:scale-110 hover:shadow-xl hover:shadow-primary/50
                      active:scale-95"
          >
            SignIn
          </Link>
          
          {/* SignUp Button */}
          <Link 
            to="/signup" 
            className="btn btn-outline btn-primary px-8 text-lg h-14
                      transform transition-all duration-300 
                      hover:scale-110 hover:bg-primary hover:text-white
                      hover:shadow-lg hover:border-transparent
                      active:scale-95"
          >
            SignUp
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
