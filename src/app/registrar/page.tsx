// src/app/registrar/page.tsx

'use client';

import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth'; // Importado o 'signOut'
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../../lib/firebase'; // Ajuste o caminho do import

// Define os tipos para as props do componente.
interface RegisterPageProps {
  setCurrentPage: (page: 'login' | 'registrar') => void;
}

export default function RegisterPage({ setCurrentPage }: RegisterPageProps) {
    // Estados para gerenciar os valores dos campos do formulário
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    // Estados para exibir mensagens de erro e sucesso
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    // Estado para controlar o carregamento do botão
    const [loading, setLoading] = useState(false);

    // Função para lidar com o envio do formulário de registro
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); // Ativa o estado de carregamento
        setError(null); // Limpa qualquer erro anterior
        setMessage(null); // Limpa qualquer mensagem anterior

        // Expressão regular para validar a senha
        // Requisitos: mínimo de 6 caracteres, pelo menos uma letra maiúscula, um número e um caractere especial
        const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,})/;

        // 1. Verifica se as senhas coincidem
        if (password !== confirmPassword) {
            setError('As senhas não coincidem. Por favor, tente novamente.');
            setLoading(false);
            return;
        }

        // 2. Verifica se a senha atende aos requisitos de validação
        if (!passwordRegex.test(password)) {
            setError('A senha deve ter pelo menos 6 caracteres, 1 letra maiúscula, 1 número e 1 caractere especial (!@#$%^&*).');
            setLoading(false);
            return;
        }

        try {
            // 3. Cria o usuário no Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 4. Salva os dados adicionais no Firestore
            const userDocRef = doc(db, 'users', user.uid); // Usa a coleção 'users' na raiz
            await setDoc(userDocRef, {
                nome: name,
                sobrenome: surname,
                email: email,
                nivel_autorizacao: 'sem_autorizacao' // Nível inicial pendente
            });

            // 5. Desloga o usuário imediatamente após o registro
            await signOut(auth);

            setMessage('Sua solicitação de cadastro foi enviada com sucesso! Aguarde a aprovação de um administrador.');
            // Opcional: Redireciona para a página de login após alguns segundos
            setTimeout(() => {
                setCurrentPage('login');
            }, 3000);

        } catch (err) {
            console.error("Erro no cadastro:", err);
            // Se houver um erro, exibe uma mensagem amigável
            setError('Erro ao registrar. Por favor, verifique se o email já está em uso.');
        } finally {
            setLoading(false); // Desativa o estado de carregamento
        }
    };

    return (
        <div className="size-control flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-md p-8 max-w-sm w-full">
                <h1 className="text-3xl font-bold text-center mb-6">Registrar</h1>
                <p className="text-center text-gray-600 mb-6">Mande uma solicitação para criar uma conta.</p>
                <form onSubmit={handleRegister}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-2"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="surname" className="block text-sm font-medium text-gray-700">Sobrenome</label>
                        <input
                            type="text"
                            id="surname"
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-2"
                            required
                        />
                    </div>
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
                    <div className="mb-4">
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirmar Senha</label>
                        <input
                            type="password"
                            id="confirm-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-2"
                            required
                        />
                    </div>
                    {/* Exibe a mensagem de erro ou sucesso */}
                    {error && <div className="text-red-500 text-sm text-center mb-4">{error}</div>}
                    {message && <div className="text-green-500 text-sm text-center mb-4">{message}</div>}
                    <button
                        type="submit"
                        className={`w-full text-palette-5 py-2 rounded-md transition-colors duration-200 disabled:opacity-50 ${loading ? 'bg-palette-2' : 'bg-palette-3 hover:bg-palette-2'}`}
                        disabled={loading} // Desabilita o botão durante o carregamento
                    >
                        {loading ? 'Enviando...' : 'Enviar solicitação'}
                    </button>
                    <div className="mt-4 text-center">
                        <span>Já tem uma conta? <a onClick={() => setCurrentPage('login')} className="text-palette-1 hover:text-palette-4 cursor-pointer">Entrar</a></span>
                    </div>
                </form>
            </div>
        </div>
    );
}
