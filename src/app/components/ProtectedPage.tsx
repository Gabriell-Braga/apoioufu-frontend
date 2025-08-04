// components/ProtectedPage.tsx
'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useAuth } from '../../../lib/AuthContext'; // Ajuste o caminho do import

interface ProtectedPageProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'escritor' | 'sem_autorizacao';
}

const ProtectedPage = ({ children, requiredRole }: ProtectedPageProps) => {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  
  // A ordem de precedência de autorização
  const roles = ['sem_autorizacao', 'escritor', 'admin'];
  
  // Função para verificar se a autorização do usuário é suficiente
  const isAuthorized = () => {
    if (!requiredRole) return true;
    if (!userData) return false;
    const userRoleIndex = roles.indexOf(userData.nivel_autorizacao);
    const requiredRoleIndex = roles.indexOf(requiredRole);
    return userRoleIndex >= requiredRoleIndex;
  };

  useEffect(() => {
    // Redireciona se o estado de carregamento for falso e o usuário não existir
    if (!loading && !user) {
      router.push('/login');
    }
    // Redireciona se o usuário não tiver a autorização necessária
    if (!loading && user && !isAuthorized()) {
        router.push('/'); // Redireciona para a home ou outra página
    }
  }, [user, loading, userData, requiredRole, router]);

  // Exibe uma tela de carregamento enquanto o status de autenticação é verificado
  if (loading || !user || !isAuthorized()) {
    return (
      <div className="absolute inset-0 flex items-center justify-center w-screen bg-gray-100">
        <p className="text-xl font-medium text-gray-700">Verificando autenticação...</p>
      </div>
    );
  }

  // Se o usuário está logado e autorizado, renderiza o conteúdo da página
  return <>{children}</>;
};

export default ProtectedPage;