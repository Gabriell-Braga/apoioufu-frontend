"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { useAuth } from '../../../lib/AuthContext';
import { auth } from '../../../lib/firebase';

const Header = () => {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  // Estados para controlar a cor de fundo do cabeçalho
  const [headerBg, setHeaderBg] = useState('bg-palette-5');
  // Estado para controlar a cor do texto/links
  const [textColor, setTextColor] = useState('text-palette-3');
  // Estado para controlar o tamanho da logo
  const [logoSize, setLogoSize] = useState('h-16 w-auto');
  // Estado para controlar a fonte da logo
  const [logoSrc, setLogoSrc] = useState('/logo-escrita.png');
  // Estado para controlar a visibilidade do menu mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // NOVO ESTADO para controlar a visibilidade do dropdown de escritor no menu mobile
  const [isWriterDropdownOpen, setIsWriterDropdownOpen] = useState(false);
  // NOVO ESTADO para controlar a visibilidade do dropdown do usuário no menu mobile
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);

  // Lógica para deslogar do Firebase
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleScroll = () => {
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
          // Fechar os dropdowns mobile ao fechar o menu principal
          setIsMobileDropdownOpen(false);
          setIsWriterDropdownOpen(false);
        }
      };

      window.addEventListener('scroll', handleScroll);

      // Limpa os event listeners ao desmontar o componente para evitar vazamentos de memória
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isMobileMenuOpen]);

  // Função para alternar a visibilidade do menu mobile
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  // Função para alternar o dropdown mobile do usuário
  const toggleMobileDropdown = () => {
    setIsMobileDropdownOpen(!isMobileDropdownOpen);
  };

  // Função para alternar o dropdown mobile do escritor
  const toggleWriterDropdown = () => {
    setIsWriterDropdownOpen(!isWriterDropdownOpen);
  };

  if (loading) {
    return null;
  }

  const userRole = userData?.nivel_autorizacao;
  const isWriterOrAdmin = userRole === 'escritor' || userRole === 'admin';
  const isAdmin = userRole === 'admin';

  // Obtém o nome e sobrenome do userData
  const userFirstName = userData?.nome;
  const userLastName = userData?.sobrenome;
  // Constrói o nome completo de forma segura
  let fullName = 'Usuário';
  if (userFirstName) {
      fullName = userLastName ? `${userFirstName} ${userLastName}` : userFirstName;
  }

  return (
    <header
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
        <nav className="hidden md:block">
          <ul className="flex space-x-6 items-center">
            <li>
              <a
                href="/denunciar"
                className={`relative group ${textColor} hover:text-opacity-80 transition-colors duration-300 pb-1`}
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
            {/* NOVO: DROP-DOWN DE ESCRITOR (DESKTOP) */}
            {isWriterOrAdmin && (
              <li className="relative group py-2">
                <span
                  className={`relative cursor-pointer ${textColor} hover:text-opacity-80 transition-colors duration-300`}
                >
                  Escritores <i className="fas fa-chevron-down ml-1 text-xs"></i>
                </span>
                <div
                  className={`absolute right-0 top-full mt-0 w-48 border border-gray-100 ${textColor === 'text-palette-5' ? 'bg-palette-3' : 'bg-palette-5'} rounded-md shadow-lg py-1 hidden group-hover:block z-10`}
                >
                  <a
                    href="/escrever-noticia"
                    className={`block w-full text-left px-4 py-2 text-sm ${textColor === 'text-palette-5' ? 'text-palette-5' : 'text-palette-3'} hover:text-palette-1 cursor-pointer transition-colors duration-300`}
                  >
                    Escrever Notícia
                  </a>
                  <a
                    href="/gerenciar-noticias"
                    className={`block w-full text-left px-4 py-2 text-sm ${textColor === 'text-palette-5' ? 'text-palette-5' : 'text-palette-3'} hover:text-palette-1 cursor-pointer transition-colors duration-300`}
                  >
                    Gerenciar Notícias
                  </a>
                </div>
              </li>
            )}

            {/* DROP-DOWN DE USUÁRIO (DESKTOP) */}
            <li className="relative group py-2">
              {user ? (
                <>
                  {/* Nome do usuário que aparece sempre */}
                  <span
                    className={`relative cursor-pointer font-bold ${textColor} hover:text-opacity-80 transition-colors duration-300`}
                  >
                    {fullName} <i className="fas fa-chevron-down ml-1 text-xs"></i>
                  </span>

                  {/* Menu dropdown que aparece no hover do contêiner pai */}
                  <div
                    className={`absolute right-0 top-full mt-0 w-48 border border-gray-100 ${textColor === 'text-palette-5' ? 'bg-palette-3' : 'bg-palette-5'} rounded-md shadow-lg py-1 hidden group-hover:block z-10`}
                  >
                    <button
                      onClick={handleLogout}
                      className={`block w-full text-left px-4 py-2 text-sm ${textColor === 'text-palette-5' ? 'text-palette-5' : 'text-palette-3'} hover:text-red-400 cursor-pointer transition-colors duration-300`}
                    >
                      Sair
                    </button>
                  </div>
                </>
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
              className="w-8 h-8"
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
          isMobileMenuOpen ? 'max-h-screen pt-4' : 'max-h-0 py-0'
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
          {isAdmin && (
            <li>
              <a href="/users" className={`${textColor} hover:text-opacity-80 transition-colors duration-300`}>
                Usuários
              </a>
            </li>
          )}
          {/* NOVO: DROP-DOWN DE ESCRITOR (MOBILE) */}
          {isWriterOrAdmin && (
            <li className='w-full'>
              <div className="relative w-full text-center">
                <button
                  onClick={toggleWriterDropdown}
                  className={`relative ${textColor} hover:text-opacity-80 transition-colors duration-300`}
                >
                  Escritores <i className={`fas fa-chevron-down ml-1 text-xs transition-transform duration-300 ${isWriterDropdownOpen ? 'rotate-180' : ''}`}></i>
                </button>
                <div className={`py-1 w-full flex flex-col items-center justify-center bg-gray-100 mt-2 ${isWriterDropdownOpen ? 'block' : 'hidden'}`}>
                  <a
                    href="/escrever-noticia"
                    className={`block w-full text-center px-4 py-2 text-sm text-palette-3  hover:text-palette-1 transition-colors duration-300`}
                  >
                    Escrever Notícia
                  </a>
                  <a
                    href="/gerenciar-noticias"
                    className={`block w-full text-center px-4 py-2 text-sm text-palette-3  hover:text-palette-1 transition-colors duration-300`}
                  >
                    Gerenciar Notícias
                  </a>
                </div>
              </div>
            </li>
          )}
          {/* DROP-DOWN DE USUÁRIO (MOBILE) */}
          <li className='w-full flex items-center justify-center'>
            {user ? (
              <div className="relative w-full text-center">
                <button
                  onClick={toggleMobileDropdown}
                  className={`relative font-bold ${textColor} hover:text-opacity-80 transition-colors duration-300 mb-2`}
                >
                  {fullName} <i className={`fas fa-chevron-down ml-1 text-xs transition-transform duration-300 ${isMobileDropdownOpen ? 'rotate-180' : ''}`}></i>
                </button>
                <div className={`py-1 w-full flex flex-col items-center justify-center bg-gray-100 ${isMobileDropdownOpen ? 'block' : 'hidden'}`}>
                  <button
                    onClick={handleLogout}
                    className={`block text-center px-4 py-2 text-sm text-palette-3 hover:text-red-400 transition-colors duration-300`}
                  >
                    Sair
                  </button>
                </div>
              </div>
            ) : (
              <a href="/login" className={`${textColor} hover:text-opacity-80 transition-colors duration-300 font-bold mb-2`}>
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
