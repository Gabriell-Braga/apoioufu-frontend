// page.tsx
import React from 'react';

// Este é o componente da sua página "Home" no Pages Router.
// Ele será acessível na rota /home.
const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-palette-5 text-palette-3">
      <div className="w-full flex items-center justify-center bg-[url('/silence-is-violence.jpg')] bg-size-[auto_250%] bg-no-repeat bg-position-[left_100%_center] h-[600px]">
        <div className="w-[1200px] h-96">
        </div>
      </div>
    </div>
  );
};

export default HomePage;
