import React from 'react';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-[#2b2b2b] text-center">
      <h1 className="text-9xl font-bold text-gray-800 dark:text-sky-blue animate-bounce">404</h1>
      <p className="text-2xl font-semibold text-gray-600 mt-4 animate-fade-in">
        Oops! Page Not Found
      </p>
      <p className="text-gray-500 mt-2 animate-fade-in delay-2">
        The page you are looking for does not exist or has been moved.
      </p>
      <button
        onClick={() => window.location.href = '/dashboard'}
        className="mt-8 px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
      >
        Go Back Home
      </button>
    </div>
  );
}

export default NotFound;
