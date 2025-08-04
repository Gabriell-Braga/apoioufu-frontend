// components/ProtectedPage.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '../../../lib/AuthContext'; // Ajuste o caminho do import

export default function ProtectedPage({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redireciona para a página de login se o usuário não estiver logado
    // e o estado de carregamento for falso.
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Exibe uma tela de carregamento enquanto o status de autenticação é verificado
  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl font-medium text-gray-700">Verificando autenticação...</p>
      </div>
    );
  }

  // Se o usuário está logado, renderiza o conteúdo da página
  return <>{children}</>;
}