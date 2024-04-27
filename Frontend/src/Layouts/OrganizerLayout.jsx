import React from 'react';
import Header from '../Components/Header/Header'; // Assuming you have a Header component

const OrganizerLayout = ({ children }) => {

  return (
    <div className="flex h-screen overflow-hidden">
      <main className="flex flex-col w-full">
        {/* Header */}
        <header className="flex items-center justify-center">
          <Header />
        </header>
        
        {/* Content */}
        <div className="md:flex-grow overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default OrganizerLayout;
