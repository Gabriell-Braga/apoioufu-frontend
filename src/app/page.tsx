// page.tsx
import React from 'react';

// Este é o componente da sua página "Home" no Pages Router.
// Ele será acessível na rota /home.
const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-palette-5 text-palette-3">
      <div className="w-full flex items-center justify-center mt-24">
        <div className="w-[1200px] h-[500px] bg-[url('/silence-is-violence.jpg')] bg-size-[auto_250%] bg-position-[left_70%_center] rounded-4xl shadow-lg overflow-hidden">
          <div className="bg-linear-to-l from-palette-3 to-transparent from-10% h-full w-full flex flex-col items-end justify-center text-palette-5 p-12 gap-10">
            <h1 className="text-6xl font-semibold">Silêncio é Violência!</h1>
            <p className="max-w-96 text-end">Não fique em <b>silêncio</b> diante da opressão. Sua voz é importante! Aprenda a se manifestar ou entre em contato com a gente.</p>
            <div className="flex items-center justify-end gap-5">
              <button className="bg-transparent border-2 border-palette-5 text-palette-5 py-2 px-4 rounded-full cursor-pointer hover:bg-palette-5 hover:text-palette-3 transition-colors ease-in-out duration-200">Aprender a se manifestar</button>
              <button className="bg-palette-5 text-palette-3 py-2 px-4 rounded-full cursor-pointer hover:bg-palette-1 transition-colors ease-in-out duration-200">Fazer uma denúncia</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
