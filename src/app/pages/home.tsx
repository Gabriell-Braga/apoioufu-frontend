// pages/home.tsx
import React from 'react';

// Este é o componente da sua página "Home" no Pages Router.
// Ele será acessível na rota /home.
const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-palette-5 text-palette-3">
      {/*
        Se você já configurou seu Header em _app.js (ou _app.tsx) para o Pages Router,
        o padding-top (pt-16) no <main> do layout.tsx (ou equivalente) já deve empurrar
        este conteúdo para baixo do seu cabeçalho fixo.
      */}
      <h1 className="text-5xl font-bold mb-6 text-center">Bem-vindo à Página Home!</h1>
      <p className="text-xl text-center mb-8 max-w-2xl">
        Esta é uma página separada criada na pasta `pages`.
        Você pode acessá-la em `/home`.
      </p>
      <div className="space-y-4 text-center">
        <a
          href="#"
          className="inline-block px-8 py-3 rounded-full bg-palette-1 text-palette-3 font-semibold hover:bg-palette-4 transition-colors duration-300 shadow-md"
        >
          Explorar Notícias
        </a>
        <p className="text-lg">
          <a href="/login" className="text-palette-2 hover:underline transition-colors duration-300">
            Já tem uma conta? Faça login!
          </a>
        </p>
      </div>

      {/* Exemplo de mais conteúdo para preencher a página e testar o scroll do header */}
      <div className="mt-20 p-8 bg-palette-4 text-palette-3 rounded-lg shadow-xl w-full max-w-4xl">
        <h2 className="text-3xl font-bold mb-4">Seção de Destaque</h2>
        <p className="text-lg leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </div>

      <div className="mt-20 p-8 bg-palette-1 text-palette-3 rounded-lg shadow-xl w-full max-w-4xl">
        <h2 className="text-3xl font-bold mb-4">Últimas Atualizações</h2>
        <p className="text-lg leading-relaxed">
          Aqui você pode adicionar cards de notícias, feeds de informações, ou qualquer outro conteúdo dinâmico.
          Aproveite a flexibilidade do Next.js para criar uma experiência rica para seus usuários.
        </p>
      </div>

      <div className="mt-20 p-8 bg-palette-2 text-palette-5 rounded-lg shadow-xl w-full max-w-4xl">
        <h2 className="text-3xl font-bold mb-4">Sobre Nós</h2>
        <p className="text-lg leading-relaxed">
          Conheça mais sobre nossa missão e o que nos move a trazer as melhores notícias e informações para você.
          Nossa equipe está dedicada a fornecer conteúdo de qualidade e relevante.
        </p>
      </div>

      <div className="h-48"></div> {/* Espaço extra para garantir que a página seja rolada e o header mude */}
    </div>
  );
};

export default HomePage;
