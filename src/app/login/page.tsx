// src/app/login/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../lib/firebase'; // Ajuste o caminho do import

interface LoginPageProps {
  // A prop setCurrentPage não é mais necessária para o redirecionamento
  // porque o useRouter do Next.js irá gerenciar isso.
  // No entanto, ela é mantida para o link "Registre-se".
  setCurrentPage: (page: 'login' | 'registrar') => void;
}

export default function LoginPage({ setCurrentPage }: LoginPageProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter(); // Instância do router para navegação

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Se o login for bem-sucedido, redireciona para a página inicial ('/')
            router.push('/');
        } catch (err) {
            console.error("Erro no login:", err);
            setError('Credenciais inválidas. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="size-control flex items-center justify-center">
            <div className="p-8 max-w-sm w-full bg-white shadow-md rounded-lg">
                <h1 className="text-3xl font-bold text-center mb-6">Entrar</h1>
                <p className="text-center text-gray-600 mb-6">Bem-vindo de volta! Por favor, insira suas credenciais para continuar.</p>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-2"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-2"
                            required
                        />
                    </div>
                    {error && <div className="text-red-500 text-sm text-center mb-4">{error}</div>}
                    <button
                        type="submit"
                        className={`w-full text-palette-5 py-2 rounded-md transition-colors duration-200 disabled:opacity-50 ${loading ? 'bg-palette-2' : 'bg-palette-3 hover:bg-palette-2'}`}
                        disabled={loading}
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                    <div className="mt-4 text-center">
                        <span>Não tem uma conta? <a onClick={() => setCurrentPage('registrar')} className="text-palette-1 hover:text-palette-4 cursor-pointer">Registre-se</a></span>
                    </div>
                </form>
            </div>
        </div>
    );
}

