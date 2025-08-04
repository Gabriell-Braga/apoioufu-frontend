// src/app/login/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'; // Importado o 'signOut'
import { doc, getDoc } from 'firebase/firestore'; // Importado o 'getDoc'
import { auth, db } from '../../../lib/firebase'; // Importa a instância do auth do seu arquivo firebase.js

// Define os tipos para as props do componente.
interface LoginPageProps {
  setCurrentPage: (page: 'login' | 'registrar') => void;
}

export default function LoginPage({ setCurrentPage }: LoginPageProps) {
    // Estados para gerenciar os valores dos campos do formulário
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // Estado para exibir mensagens de erro
    const [error, setError] = useState<string | null>(null);
    // Estado para controlar o carregamento do botão
    const [loading, setLoading] = useState(false);
    const router = useRouter(); // Instância do router para navegação

    // Função para lidar com o envio do formulário de login
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); // Ativa o estado de carregamento
        setError(null); // Limpa qualquer erro anterior

        try {
            // Tenta fazer o login com email e senha usando o Firebase
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Busca os dados do usuário no Firestore para verificar o nível de autorização
            const userDocRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(userDocRef);

            if (docSnap.exists() && docSnap.data().nivel_autorizacao === 'sem_autorizacao') {
                // Se o usuário não tem autorização, faz o logout e exibe um erro
                await signOut(auth);
                setError('Sua conta ainda não foi autorizada por um administrador. Aguarde a aprovação.');
            } else {
                // Se o login for bem-sucedido e autorizado, redireciona para a página inicial ('/')
                router.push('/');
            }
        } catch (err) {
            console.error("Erro no login:", err);
            // Se houver um erro, exibe uma mensagem amigável
            setError('Credenciais inválidas. Por favor, tente novamente.');
        } finally {
            setLoading(false); // Desativa o estado de carregamento
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
                    {/* Exibe a mensagem de erro se houver */}
                    {error && <div className="text-red-500 text-sm text-center mb-4">{error}</div>}
                    <button
                        type="submit"
                        className={`w-full text-palette-5 py-2 rounded-md transition-colors duration-200 disabled:opacity-50 ${loading ? 'bg-palette-2' : 'bg-palette-3 hover:bg-palette-2'}`}
                        disabled={loading} // Desabilita o botão durante o carregamento
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

