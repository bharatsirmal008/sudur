import React from 'react';

export default function About() {
  return (
    // Main container: Min height or screen height, black background, flexbox for centering
    <div id="about" className="flex min-h-[100vh] py-20 w-full items-center justify-center bg-black text-indigo-500 p-4">
      
      {/* Text Container: 
          - text-[#e6d9e4]: Light color
          - font-bold: Bold weight
          - text-4xl to text-9xl: Responsive sizing for different screens
      */}
      <h1 className="text-center text-4xl sm:text-6xl font-bold tracking-tight text-[#e6d9e4] md:text-8xl lg:text-9xl">
        Youth Association of <br className="hidden md:block" /> Purbichauki
      </h1>

    </div>
  );
}