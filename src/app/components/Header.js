// components/Header.js
"use client"; // Adicione esta linha no topo do arquivo para marcá-lo como um Client Component

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { useAuth } from '../../../lib/AuthContext'; // Importa o hook do seu contexto
import { auth } from '../../../lib/firebase'; // Importa a instância do auth do seu arquivo firebase.js

const Header = () => {
  // Pega o estado do usuário e o estado de carregamento do AuthContext
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  // Estados para controlar a cor de fundo do cabeçalho
  const [headerBg, setHeaderBg] = useState('bg-palette-5');
  // Estado para controlar a cor do texto/links
  const [textColor, setTextColor] = useState('text-palette-3');
  // Estado para controlar o tamanho da logo
  const [logoSize, setLogoSize] = useState('h-16 w-auto'); // Tamanho inicial da logo
  // Estado para controlar a fonte da logo
  const [logoSrc, setLogoSrc] = useState('/logo-escrita.png'); // Logo inicial (escura)
  // Estado para controlar a visibilidade do menu mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Lógica para deslogar do Firebase
  const handleLogout = async () => {
    try {
        await signOut(auth);
        // Redireciona para a página de login após o logout
        router.push('/login');
    } catch (error) {
        console.error("Erro ao fazer logout:", error);
    }
  };

  useEffect(() => {
    // Verifica se window está definido para garantir que o código só é executado no lado do cliente
    if (typeof window !== 'undefined') {
      const handleScroll = () => {
        // Verifica a posição do scroll
        if (window.scrollY > 50) {
          setHeaderBg('bg-palette-3');
          setTextColor('text-palette-5');
          setLogoSize('h-12 w-auto');
          setLogoSrc('/logo-escrita-branco.png');
        } else {
          setHeaderBg('bg-palette-5');
          setTextColor('text-palette-3');
          setLogoSize('h-16 w-auto');
          setLogoSrc('/logo-escrita.png');
        }
        if (isMobileMenuOpen) {
          setIsMobileMenuOpen(false);
        }
      };

      // Adiciona o event listener para o scroll
      window.addEventListener('scroll', handleScroll);

      // Remove o event listener ao desmontar o componente para evitar vazamentos de memória
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isMobileMenuOpen]); // Adicionado isMobileMenuOpen como dependência para garantir que a função handleScroll tenha o valor mais recente

  // Função para alternar a visibilidade do menu mobile
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  // Exibe um estado de carregamento para evitar o "flickering"
  if (loading) {
    return null;
  }

  // Verifica o nível de autorização do usuário
  const userRole = userData?.nivel_autorizacao;
  const isWriterOrAdmin = userRole === 'escritor' || userRole === 'admin';
  const isAdmin = userRole === 'admin';

  return (
    <header
      // Classes Tailwind para transição fluida, posição fixa e sombra
      className={`fixed top-0 left-0 w-full z-50 py-4 transition-all duration-300 ease-in-out shadow-md flex justify-center items-center ${headerBg}`}
    >
      <div className="container size-control flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex-shrink-0">
          <img
            src={logoSrc}
            alt="Logo da Empresa"
            className={`${logoSize} transition-all duration-300 ease-in-out`}
          />
        </a>

        {/* Links de navegação para desktop */}
        <nav className="hidden md:block"> {/* Oculta em telas pequenas, mostra em telas médias e grandes */}
          <ul className="flex space-x-6 items-center">
            <li>
              <a
                href="/denunciar"
                className={`relative group ${textColor} hover:text-opacity-80 transition-colors duration-300 pb-1`} // Adicionado pb-1 para espaço da linha
              >
                Denunciar
                <span
                  className={`absolute bottom-0 left-0 w-0 h-0.5 ${textColor === 'text-palette-5' ? 'bg-palette-5' : 'bg-palette-3'} group-hover:w-full transition-all duration-300 ease-in-out`}
                ></span>
              </a>
            </li>
            <li>
              <a
                href="/noticias"
                className={`relative group ${textColor} hover:text-opacity-80 transition-colors duration-300 pb-1`}
              >
                Notícias
                <span
                  className={`absolute bottom-0 left-0 w-0 h-0.5 ${textColor === 'text-palette-5' ? 'bg-palette-5' : 'bg-palette-3'} group-hover:w-full transition-all duration-300 ease-in-out`}
                ></span>
              </a>
            </li>
            <li>
              <a
                href="/sobre-nos"
                className={`relative group ${textColor} hover:text-opacity-80 transition-colors duration-300 pb-1`}
              >
                Sobre Nós
                <span
                  className={`absolute bottom-0 left-0 w-0 h-0.5 ${textColor === 'text-palette-5' ? 'bg-palette-5' : 'bg-palette-3'} group-hover:w-full transition-all duration-300 ease-in-out`}
                ></span>
              </a>
            </li>
            {isWriterOrAdmin && (
              <li>
                <a
                  href="/escrever-noticia"
                  className={`relative group ${textColor} hover:text-opacity-80 transition-colors duration-300 pb-1`}
                >
                  Escrever Notícia
                  <span
                    className={`absolute bottom-0 left-0 w-0 h-0.5 ${textColor === 'text-palette-5' ? 'bg-palette-5' : 'bg-palette-3'} group-hover:w-full transition-all duration-300 ease-in-out`}
                  ></span>
                </a>
              </li>
            )}
            {isAdmin && (
              <li>
                <a
                  href="/users"
                  className={`relative group ${textColor} hover:text-opacity-80 transition-colors duration-300 pb-1`}
                >
                  Usuários
                  <span
                    className={`absolute bottom-0 left-0 w-0 h-0.5 ${textColor === 'text-palette-5' ? 'bg-palette-5' : 'bg-palette-3'} group-hover:w-full transition-all duration-300 ease-in-out`}
                  ></span>
                </a>
              </li>
            )}
            <li>
              {/* Renderização condicional do botão de login/logout */}
              {user ? (
                <button
                  onClick={handleLogout}
                  className={`relative group ${textColor} hover:text-opacity-80 transition-colors duration-300 font-bold cursor-pointer`}
                >
                  Sair
                  <span
                    className={`absolute bottom-0 left-0 w-0 h-0.5 ${textColor === 'text-palette-5' ? 'bg-palette-5' : 'bg-palette-3'} group-hover:w-full transition-all duration-300 ease-in-out`}
                  ></span>
                </button>
              ) : (
                <a
                  href="/login"
                  className={`relative group ${textColor} hover:text-opacity-80 transition-colors duration-300 font-bold pb-1`}
                >
                  Login
                  <span
                    className={`absolute bottom-0 left-0 w-0 h-0.5 ${textColor === 'text-palette-5' ? 'bg-palette-5' : 'bg-palette-3'} group-hover:w-full transition-all duration-300 ease-in-out`}
                  ></span>
                </a>
              )}
            </li>
          </ul>
        </nav>

        {/* Botão de menu para mobile */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className={`${textColor} focus:outline-none`}>
            {/* Ícone de hambúrguer */}
            <svg
              className="w-8 h-8" // Aumentei o tamanho para melhor clique
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Menu Mobile Suspenso */}
      <div
        className={`md:hidden absolute top-full left-0 w-full ${headerBg} shadow-lg transition-all duration-500 ease-in-out overflow-hidden ${
          isMobileMenuOpen ? 'max-h-screen py-4' : 'max-h-0 py-0' // Controla a altura e padding para animação
        }`}
      >
        <ul className="flex flex-col items-center space-y-4">
          <li>
            <a href="/denunciar" className={`${textColor} hover:text-opacity-80 transition-colors duration-300`}>
              Denunciar
            </a>
          </li>
          <li>
            <a href="/noticias" className={`${textColor} hover:text-opacity-80 transition-colors duration-300`}>
              Notícias
            </a>
          </li>
          <li>
            <a href="/sobre-nos" className={`${textColor} hover:text-opacity-80 transition-colors duration-300`}>
              Sobre Nós
            </a>
          </li>
          {isWriterOrAdmin && (
            <li>
              <a href="/escrever-noticia" className={`${textColor} hover:text-opacity-80 transition-colors duration-300`}>
                Escrever Notícia
              </a>
            </li>
          )}
          {isAdmin && (
            <li>
              <a href="/users" className={`${textColor} hover:text-opacity-80 transition-colors duration-300`}>
                Usuários
              </a>
            </li>
          )}
          <li>
            {/* Renderização condicional para o menu mobile */}
            {user ? (
              <button
                onClick={handleLogout}
                className={`${textColor} hover:text-opacity-80 transition-colors duration-300 font-bold cursor-pointer`}
              >
                Sair
              </button>
            ) : (
              <a href="/login" className={`${textColor} hover:text-opacity-80 transition-colors duration-300 font-bold`}>
                Login
              </a>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
