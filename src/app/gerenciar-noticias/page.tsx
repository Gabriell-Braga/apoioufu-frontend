'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../lib/AuthContext';
import ProtectedPage from '../components/ProtectedPage';
import { db } from '../../../lib/firebase';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { Noticia } from '../../../types';
import Image from 'next/image';

const GerenciarNoticiasPage = () => {
    const { userData } = useAuth();
    const user = useAuth().user;
    const router = useRouter();
    const [noticias, setNoticias] = useState<Noticia[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>({ key: 'dataCriacao', direction: 'descending' });
    const [showModal, setShowModal] = useState(false);
    const [noticiaToDelete, setNoticiaToDelete] = useState<string | null>(null);

    useEffect(() => {
        const fetchNoticias = async () => {
            try {
                setLoading(true);
                const q = query(collection(db, 'noticias'), orderBy('dataCriacao', 'desc'));
                const querySnapshot = await getDocs(q);
                const fetchedNoticias = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Noticia[];
                setNoticias(fetchedNoticias);
            } catch (err) {
                console.error("Erro ao buscar notícias:", err);
                setError("Ocorreu um erro ao carregar as notícias.");
            } finally {
                setLoading(false);
            }
        };
        fetchNoticias();
    }, []);

    const sortedNoticias = React.useMemo(() => {
        let sortableItems = [...noticias];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const aValue = a[sortConfig.key as keyof Noticia];
                const bValue = b[sortConfig.key as keyof Noticia];

                if (sortConfig.key === 'dataCriacao') {
                    const dateA = (aValue as { toDate: () => Date })?.toDate()?.getTime() || 0;
                    const dateB = (bValue as { toDate: () => Date })?.toDate()?.getTime() || 0;
                    if (dateA < dateB) {
                        return sortConfig.direction === 'ascending' ? -1 : 1;
                    }
                    if (dateA > dateB) {
                        return sortConfig.direction === 'ascending' ? 1 : -1;
                    }
                    return 0;
                } else {
                    const aStr = String(aValue || '');
                    const bStr = String(bValue || '');
                    if (aStr < bStr) {
                        return sortConfig.direction === 'ascending' ? -1 : 1;
                    }
                    if (aStr > bStr) {
                        return sortConfig.direction === 'ascending' ? 1 : -1;
                    }
                    return 0;
                }
            });
        }
        return sortableItems;
    }, [noticias, sortConfig]);

    const requestSort = (key: string) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleEdit = (id: string) => {
        router.push(`/editar/${id}`);
    };

    // NOVO: Função para lidar com o clique no botão "Ver"
    const handleView = (slug: string) => {
        router.push(`/noticia/${slug}`);
    };

    const handleDeleteClick = (id: string) => {
        setNoticiaToDelete(id);
        setShowModal(true);
    };

    const confirmDelete = async () => {
        if (!noticiaToDelete) return;

        try {
            await deleteDoc(doc(db, 'noticias', noticiaToDelete));
            setNoticias(noticias.filter(noticia => noticia.id !== noticiaToDelete));
            setNoticiaToDelete(null);
            setShowModal(false);
            setError("Notícia deletada com sucesso!");
            setTimeout(() => setError(null), 3000);
        } catch (err) {
            console.error("Erro ao deletar notícia:", err);
            setError("Ocorreu um erro ao tentar deletar a notícia.");
        }
    };

    const cancelDelete = () => {
        setNoticiaToDelete(null);
        setShowModal(false);
    };
    
    const userRole = userData?.nivel_autorizacao;
    const currentUserId = user?.uid; // Obtém o UID do usuário logado

    if (loading) {
        return (
            <ProtectedPage requiredRole="escritor">
                <div className="flex justify-center items-center h-screen">
                    <p className="text-xl">Carregando notícias...</p>
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
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Gerenciar Notícias</h1>
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Imagem
                                    </th>
                                    <th 
                                        onClick={() => requestSort('titulo')}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                    >
                                        Título
                                        {sortConfig?.key === 'titulo' && (
                                            <span className={`ml-2 inline-block transition-transform duration-200 ${sortConfig?.direction === 'descending' ? 'rotate-180' : ''}`}>▼</span>
                                        )}
                                    </th>
                                    <th 
                                        onClick={() => requestSort('tag')}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                    >
                                        Tag
                                        {sortConfig?.key === 'tag' && (
                                            <span className={`ml-2 inline-block transition-transform duration-200 ${sortConfig?.direction === 'descending' ? 'rotate-180' : ''}`}>▼</span>
                                        )}
                                    </th>
                                    <th 
                                        onClick={() => requestSort('status')}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                    >
                                        Status
                                        {sortConfig?.key === 'status' && (
                                            <span className={`ml-2 inline-block transition-transform duration-200 ${sortConfig?.direction === 'descending' ? 'rotate-180' : ''}`}>▼</span>
                                        )}
                                    </th>
                                    <th 
                                        onClick={() => requestSort('dataCriacao')}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                    >
                                        Data
                                        {sortConfig?.key === 'dataCriacao' && (
                                            <span className={`ml-2 inline-block transition-transform duration-200 ${sortConfig?.direction === 'descending' ? 'rotate-180' : ''}`}>▼</span>
                                        )}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {sortedNoticias.map((noticia) => (
                                    <tr key={noticia.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {noticia.imagem && (
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <Image 
                                                        className="h-10 w-10 rounded-md object-cover"
                                                        src={noticia.imagem}
                                                        alt={`Imagem da notícia ${noticia.titulo}`}
                                                        width={40}
                                                        height={40}
                                                        onError={(e) => {
                                                            e.currentTarget.src = `https://placehold.co/40x40/E5E7EB/4B5563?text=Img`;
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {noticia.titulo}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {noticia.tag}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${noticia.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {noticia.status === 'published' ? 'Publicado' : 'Rascunho'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {noticia.dataCriacao && (
                                                <div className="text-sm text-gray-900">
                                                    {(noticia.dataCriacao as { toDate: () => Date }).toDate().toLocaleDateString('pt-BR')}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {/* NOVO: Botão "Ver" com lógica de permissão */}
                                            {(userRole === 'admin' || noticia.autorId === currentUserId || noticia.status === 'published') && (
                                                <button
                                                    onClick={() => noticia.slug && handleView(noticia.slug)}
                                                    className="text-blue-600 hover:text-blue-900 mr-4 cursor-pointer"
                                                >
                                                    Ver
                                                </button>
                                            )}
                                            {(userRole === 'admin' || noticia.autorId === currentUserId) && (
                                                <button
                                                    onClick={() => handleEdit(noticia.id)}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-4 cursor-pointer"
                                                >
                                                    Editar
                                                </button>
                                            )}
                                            {userRole === 'admin' && (
                                                <button
                                                    onClick={() => handleDeleteClick(noticia.id)}
                                                    className="text-red-600 hover:text-red-900 cursor-pointer"
                                                >
                                                    Deletar
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal de Confirmação Personalizado */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600/50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full mx-auto">
                        <div className="text-center">
                            <h3 className="text-xl font-bold mb-4 text-gray-900">Confirmar Exclusão</h3>
                            <p className="text-gray-700">Tem certeza que deseja deletar esta notícia?</p>
                            <div className="mt-6 flex justify-center space-x-4">
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                >
                                    Sim, Deletar
                                </button>
                                <button
                                    onClick={cancelDelete}
                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </ProtectedPage>
    );
};

export default GerenciarNoticiasPage;
