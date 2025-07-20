// page.tsx
import React from 'react';

// Este é o componente da sua página "Home" no Pages Router.
// Ele será acessível na rota /home.
const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-palette-5 text-palette-3">

      {/* banner */}
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

      {/* noticias */}
      <div className="w-full flex items-center justify-center my-16">
        <div className="w-[1200px] flex flex-col items-center justify-center gap-10">
          <h2 className="text-4xl font-semibold">Últimas Notícias</h2>
          <div className="grid grid-cols-4 grid-rows-2 gap-5 w-full">
            {/* Exemplo de cards de notícias */}
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-palette-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-start justify-center">
                <div className="w-full">
                  <img src={`/noticia-${index + 1}.jpg`} alt={`Notícia ${index + 1}`} className="w-full h-40 object-cover rounded-lg mb-4" />
                </div>
                <div className="flex flex-col items-start justify-between w-full p-6">
                  <p className="text-xs text-gray-500">March 20 2015</p>
                  <h3 className="text-2xl font-semibold mb-2">Notícia {index + 1}</h3>
                  <p className="text-xs h-20">Descrição breve da notícia.</p>
                  <a href="" className="text-palette-2 hover:text-palette-1">Ler mais →</a>
                </div>
              </div>
            ))}
          </div>
          <a href="/noticias" className="bg-palette-3 text-palette-5 py-2 px-4 rounded-full cursor-pointer hover:bg-palette-1 transition-colors ease-in-out duration-200">Ver mais notícias</a>
        </div>
      </div>

      {/* banner final */}
      <div className="w-full flex items-center justify-center my-16">
        <div className="w-[1200px] bg-size-cover bg-position-center rounded-4xl shadow-lg overflow-hidden">
          <div className="bg-palette-3 h-full w-full flex flex-col items-end justify-center text-palette-5 p-10 gap-10">
            <h1 className="text-6xl font-semibold">Juntos somos mais fortes!</h1>
            <p className="max-w-96 text-end">Apoie a luta contra a opressão. Sua participação é fundamental!</p>
            <button className="bg-palette-5 text-palette-3 py-2 px-4 rounded-full cursor-pointer hover:bg-palette-1 transition-colors ease-in-out duration-200">Saiba mais</button>
          </div>
        </div>
      </div>

      {/* footer */}
      <footer className="w-full bg-palette-3 text-palette-3 py-8">
        <div className="w-full max-w-[1200px] mx-auto flex items-center justify-between">
          <p className="text-sm text-palette-5">© 2025 Apoio UFU. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-gray-200 hover:text-palette-1">Política de Privacidade</a>
            <a href="#" className="text-gray-200 hover:text-palette-1">Termos de Uso</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
