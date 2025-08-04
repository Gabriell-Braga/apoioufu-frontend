'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../../lib/AuthContext';
import ProtectedPage from '../../components/ProtectedPage';
import { db } from '../../../../lib/firebase';
import { doc, getDoc, updateDoc, serverTimestamp, FieldValue } from 'firebase/firestore';
import { Noticia } from '../../../../types';

// Importa os componentes do TinyMCE
import { Editor } from '@tinymce/tinymce-react';

const EditarNoticiaPage = () => {
    const { userData } = useAuth();
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    // Estados para o formulário
    const [titulo, setTitulo] = useState('');
    const [resumo, setResumo] = useState('');
    const [conteudo, setConteudo] = useState('');
    const [tag, setTag] = useState('');
    const [imagem, setImagem] = useState('');
    
    // Estados para feedback
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    // Manipulador de conteúdo do TinyMCE
    const handleEditorChange = (content: string, editor: any) => {
        setConteudo(content);
    };

    useEffect(() => {
        const fetchNoticia = async () => {
            if (!id) return;
            try {
                const docRef = doc(db, 'noticias', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data() as Noticia;
                    setTitulo(data.titulo);
                    setResumo(data.resumo);
                    setConteudo(data.conteudo || '');
                    setTag(data.tag || '');
                    setImagem(data.imagem || '');
                } else {
                    setError("Notícia não encontrada.");
                }
            } catch (err) {
                console.error("Erro ao carregar notícia para edição:", err);
                setError("Ocorreu um erro ao carregar a notícia.");
            } finally {
                setLoading(false);
            }
        };

        fetchNoticia();
    }, [id]);

    const handleUpdate = async (e: React.FormEvent, status: 'draft' | 'published') => {
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
            const updatedNoticia = {
                titulo: titulo,
                resumo: resumo,
                conteudo: conteudo,
                dataAtualizacao: serverTimestamp() as FieldValue,
                tag,
                imagem,
                status,
            };

            const docRef = doc(db, 'noticias', id);
            await updateDoc(docRef, updatedNoticia);

            if (status === 'published') {
                setMessage('Notícia atualizada e publicada com sucesso! Redirecionando...');
            } else {
                setMessage('Notícia atualizada e salva como rascunho com sucesso!');
            }
            
            setTimeout(() => {
                router.push('/gerenciar-noticias');
            }, 2000);

        } catch (err) {
            console.error("Erro ao atualizar notícia:", err);
            setError('Ocorreu um erro ao tentar atualizar a notícia. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <ProtectedPage requiredRole="escritor">
                <div className="flex justify-center items-center h-screen">
                    <p className="text-xl">Carregando notícia para edição...</p>
                </div>
            </ProtectedPage>
        );
    }
    
    if (error) {
        return (
            <ProtectedPage requiredRole="escritor">
                <div className="flex justify-center items-center h-screen">
                    <p className="text-red-500 text-xl">{error}</p>
                </div>
            </ProtectedPage>
        );
    }

    return (
        <ProtectedPage requiredRole="escritor">
            <div className="size-control mb-16">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Editar Notícia</h1>
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <form>
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
                            <label htmlFor="conteudo" className="block text-sm font-medium text-gray-700 mb-2">Conteúdo</label>
                            <Editor
                                apiKey="4jboxnhq1f9r9s3pm0x4z8y6ea6svfh60jnsretphcxyxk4m"
                                value={conteudo}
                                onEditorChange={handleEditorChange}
                                init={{
                                    height: 500,
                                    menubar: true,
                                    plugins: [
                                        'advlist autolink lists link image charmap print preview anchor',
                                        'searchreplace visualblocks code fullscreen',
                                        'insertdatetime media table paste code help wordcount'
                                    ],
                                    toolbar:
                                        'undo redo | styleselect | forecolor backcolor | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media | code fullscreen | table | help'
                                }}
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

                        <div className="flex space-x-4">
                            <button
                                type="button"
                                onClick={(e) => handleUpdate(e, 'draft')}
                                className={`flex-1 text-gray-700 py-2 rounded-md transition-colors duration-200 disabled:opacity-50 border border-gray-300 ${loading ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
                                disabled={loading}
                            >
                                {loading ? 'Salvando...' : 'Salvar como Rascunho'}
                            </button>
                            <button
                                type="submit"
                                onClick={(e) => handleUpdate(e, 'published')}
                                className={`flex-1 text-palette-5 py-2 rounded-md transition-colors duration-200 disabled:opacity-50 ${loading ? 'bg-palette-2' : 'bg-palette-3 hover:bg-palette-2'}`}
                                disabled={loading}
                            >
                                {loading ? 'Publicando...' : 'Publicar Notícia'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </ProtectedPage>
    );
};

export default EditarNoticiaPage;
