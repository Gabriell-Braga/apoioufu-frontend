// src/app/escrever-noticia/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../lib/AuthContext';
import ProtectedPage from '../components/ProtectedPage';
import { db } from '../../../lib/firebase';
import { collection, addDoc, serverTimestamp, FieldValue } from 'firebase/firestore'; // Importa FieldValue
import { Noticia } from '../../../types'; // Importa a interface Noticia

const WriteArticlePage = () => {
    const { userData } = useAuth();
    const router = useRouter();

    // Estados para o formulário
    const [titulo, setTitulo] = useState('');
    const [resumo, setResumo] = useState('');
    const [conteudo, setConteudo] = useState('');
    const [tag, setTag] = useState('');
    const [imagem, setImagem] = useState('');
    
    // Estados para feedback
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        if (!userData || !userData.nome) {
            setError('Não foi possível identificar o autor da notícia. Por favor, tente novamente.');
            setLoading(false);
            return;
        }

        try {
            // Cria o objeto da nova notícia
            const newNoticia: Omit<Noticia, 'id'> = {
                titulo,
                resumo,
                conteudo,
                autor: userData.nome + ' ' + (userData.sobrenome || ''), // Combina nome e sobrenome
                dataCriacao: serverTimestamp() as FieldValue, // Adiciona o cast para FieldValue
                tag,
                imagem,
            };

            // Adiciona o documento à coleção 'noticias' no Firestore
            await addDoc(collection(db, 'noticias'), newNoticia);

            setMessage('Notícia publicada com sucesso! Redirecionando...');
            // Limpa o formulário após o envio bem-sucedido
            setTitulo('');
            setResumo('');
            setConteudo('');
            setTag('');
            setImagem('');
            
            // Redireciona para a página de notícias após um pequeno atraso
            setTimeout(() => {
                router.push('/noticias');
            }, 2000);

        } catch (err) {
            console.error("Erro ao publicar notícia:", err);
            setError('Ocorreu um erro ao tentar publicar a notícia. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedPage requiredRole="escritor">
            <div className="container mx-auto p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Escrever Notícia</h1>
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">Título</label>
                            <input
                                type="text"
                                id="titulo"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-2"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="resumo" className="block text-sm font-medium text-gray-700">Resumo</label>
                            <textarea
                                id="resumo"
                                value={resumo}
                                onChange={(e) => setResumo(e.target.value)}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-2"
                                rows={3}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="conteudo" className="block text-sm font-medium text-gray-700">Conteúdo</label>
                            <textarea
                                id="conteudo"
                                value={conteudo}
                                onChange={(e) => setConteudo(e.target.value)}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-2"
                                rows={10}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="tag" className="block text-sm font-medium text-gray-700">Tag (opcional)</label>
                            <input
                                type="text"
                                id="tag"
                                value={tag}
                                onChange={(e) => setTag(e.target.value)}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-2"
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="imagem" className="block text-sm font-medium text-gray-700">URL da Imagem (opcional)</label>
                            <input
                                type="text"
                                id="imagem"
                                value={imagem}
                                onChange={(e) => setImagem(e.target.value)}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-2"
                            />
                        </div>

                        {error && <div className="text-red-500 text-sm text-center mb-4">{error}</div>}
                        {message && <div className="text-green-500 text-sm text-center mb-4">{message}</div>}

                        <button
                            type="submit"
                            className={`w-full text-palette-5 py-2 rounded-md transition-colors duration-200 disabled:opacity-50 ${loading ? 'bg-palette-2' : 'bg-palette-3 hover:bg-palette-2'}`}
                            disabled={loading}
                        >
                            {loading ? 'Publicando...' : 'Publicar Notícia'}
                        </button>
                    </form>
                </div>
            </div>
        </ProtectedPage>
    );
};

export default WriteArticlePage;
