import React from 'react';
import Searchbar from '../Searchbar/Searchbar';

const Banner = () => {
  return (
    <div className="w-full h-[400px] flex flex-col items-center justify-center bg-gradient-to-r from-[#ffef64] to-[#babaee] p-6 rounded-2xl shadow-lg text-center">
      <h1 className="text-4xl font-bold text-white drop-shadow-md">
        Welcome to <span className="text-yellow-600">Link</span>
        <span className="text-blue-600">Hive</span>
      </h1>
      <p className="text-lg bg-clip-text text-transparent bg-gradient-to-r from-slate-600 via-purple-600 to-white">
        Your buzzing hub for engaging discussions and vibrant communities.
      </p>
      <Searchbar/>
      <div className="mt-4">
        <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition-transform transform hover:scale-105">
          Join the Hive
        </button>
        <button className="ml-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition-transform transform hover:scale-105">
          Explore Discussions
        </button>
      </div>
    </div>
  );
};

export default Banner;
