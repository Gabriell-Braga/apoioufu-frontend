'use client';

import React, { useEffect, useState, useRef } from 'react';
import { db } from '../../../lib/firebase';
import { collection, getDocs, orderBy, query, Timestamp, where, startAfter, limit } from "firebase/firestore";
import { Noticia } from '../../../types';
import Image from 'next/image';

const POSTS_PER_PAGE = 8; // Define o número de notícias a serem carregadas no grid por vez

export default function NewsPage() {
    const [noticias, setNoticias] = useState<Noticia[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [lastVisible, setLastVisible] = useState<any>(null);
    const [hasMore, setHasMore] = useState(true);
    // CORREÇÃO: Adicionando 'null' como valor inicial para o useRef
    const observer = useRef<IntersectionObserver | null>(null);
    const lastPostRef = useRef<HTMLDivElement>(null);

    const fetchNoticias = async (initial = false) => {
        try {
            if (!hasMore && !initial) return;
            setLoading(true);
            
            let noticiasQuery;
            if (initial) {
                // Carrega o número de posts do grid + 1 para o destaque
                noticiasQuery = query(
                    collection(db, "noticias"),
                    where("status", "==", "published"),
                    orderBy("dataCriacao", "desc"),
                    limit(POSTS_PER_PAGE + 1)
                );
            } else {
                noticiasQuery = query(
                    collection(db, "noticias"),
                    where("status", "==", "published"),
                    orderBy("dataCriacao", "desc"),
                    startAfter(lastVisible),
                    limit(POSTS_PER_PAGE)
                );
            }
            
            const querySnapshot = await getDocs(noticiasQuery);
            const fetchedNoticias = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            })) as Noticia[];
            
            // Lógica de paginação para carregar mais notícias
            const moreDataExists = fetchedNoticias.length > POSTS_PER_PAGE;
            const finalNoticias = moreDataExists ? fetchedNoticias.slice(0, POSTS_PER_PAGE) : fetchedNoticias;
            
            if (initial) {
                setNoticias(fetchedNoticias);
            } else {
                setNoticias(prevNoticias => [...prevNoticias, ...fetchedNoticias]);
            }
            
            setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
            setHasMore(fetchedNoticias.length-1 === POSTS_PER_PAGE);

        } catch (error) {
            console.error("Erro ao buscar notícias:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNoticias(true);
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const filteredNoticias = noticias.filter(noticia =>
        noticia.titulo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleLoadMore = () => {
        if (!loading && hasMore && filteredNoticias.length > 0) {
            fetchNoticias();
        }
    };

    useEffect(() => {
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !loading) {
                handleLoadMore();
            }
        });
        
        if (lastPostRef.current) {
            observer.current.observe(lastPostRef.current);
        }

        return () => {
            if (observer.current) observer.current.disconnect();
        };
    }, [noticias, hasMore, loading]);


    if (loading && noticias.length === 0) {
        return (
            <div className="w-full flex items-center justify-center min-h-[50vh] text-gray-500">
                Carregando notícias...
            </div>
        );
    }
    
    if (filteredNoticias.length === 0 && !loading) {
        return (
            <div className="w-full flex flex-col items-center justify-center min-h-[50vh] text-gray-500">
                <div className="w-full size-control relative mb-6">
                    <input
                        type="text"
                        placeholder="Pesquisar notícias..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full p-3 rounded-xl border border-gray-300 focus:!outline-none focus:border-palette-2 transition-colors duration-200"
                    />
                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-palette-3 hover:text-palette-1 transition-colors duration-200">
                        <i className="fas fa-magnifying-glass"></i>
                    </button>
                </div>
                {noticias.length > 0 && <p>Nenhuma notícia encontrada para o termo "{searchTerm}".</p>}
                {noticias.length === 0 && <p>Nenhuma notícia encontrada.</p>}
            </div>
        );
    }

    const noticiaDestaque = filteredNoticias[0];
    const outrasNoticias = filteredNoticias.slice(1);

    return (
        <div className="w-full flex items-center justify-center mb-24">
            <div className="size-control flex flex-col items-center justify-center gap-10">
                <div className="w-full relative">
                    <input
                        type="text"
                        placeholder="Pesquisar notícias..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full p-3 rounded-xl border border-gray-300 focus:!outline-none focus:border-palette-2 transition-colors duration-200"
                    />
                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-palette-3 hover:text-palette-1 transition-colors duration-200">
                        <i className="fas fa-magnifying-glass"></i>
                    </button>
                </div>
                
                {noticiaDestaque && (
                    <div className="bg-palette-5 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col md:flex-row items-center justify-center w-full overflow-hidden">
                        <div className="w-full md:w-1/2 relative">
                            {noticiaDestaque.imagem && (
                                <Image 
                                    src={noticiaDestaque.imagem} 
                                    alt={noticiaDestaque.titulo} 
                                    className="w-full object-cover rounded-t-xl md:rounded-l-xl md:rounded-t-none h-64 md:h-96" 
                                    width={1200}
                                    height={800}
                                />
                            )}
                            <div className="absolute bottom-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 rounded-tl-lg">
                                {noticiaDestaque.tag || "Sem Tag"}
                            </div>
                        </div>
                        <div className="flex flex-col items-start justify-between w-full md:w-1/2 p-6">
                            <p className="text-xs text-gray-500">
                                {noticiaDestaque.dataCriacao && (noticiaDestaque.dataCriacao as Timestamp).toDate().toLocaleDateString('pt-BR') || "Data Indisponível"} · {noticiaDestaque.autor || "Autor Desconhecido"}
                            </p>
                            <h1 className="text-xl md:text-2xl lg:text-4xl font-semibold mb-2">
                                {noticiaDestaque.titulo}
                            </h1>
                            <p className="text-sm h-auto md:h-20 overflow-hidden text-ellipsis">
                                {noticiaDestaque.resumo}
                            </p>
                            <a href={`/noticia/${noticiaDestaque.slug}`} className="text-palette-2 hover:text-palette-1 mt-4">
                                Ler mais →
                            </a>
                        </div>
                    </div>
                )}
                
                {outrasNoticias.length > 0 && (
                    <div className="grid lg:grid-cols-4 lg:grid-rows-2 sm:grid-cols-2 sm:grid-rows-4 grid-cols-1 grid-rows-8 gap-5 w-full">
                        {outrasNoticias.map((noticia, index) => {
                            const isLastPost = index === filteredNoticias.length - 1;
                            return (
                                <div 
                                    key={noticia.id} 
                                    className="bg-palette-5 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-start justify-between overflow-hidden"
                                    ref={isLastPost ? lastPostRef : null}
                                >
                                    <div className="w-full relative">
                                        {noticia.imagem && (
                                            <Image 
                                                src={noticia.imagem} 
                                                alt={noticia.titulo} 
                                                className="w-full h-40 object-cover rounded-t-xl" 
                                                width={600}
                                                height={400}
                                            />
                                        )}
                                        <div className="absolute bottom-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 rounded-tl-lg">
                                            {noticia.tag || "Sem Tag"}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-start justify-between w-full p-6 h-full">
                                        <div className='flex flex-col items-start justify-start'>
                                            <p className="text-xs text-gray-500">
                                                {noticia.dataCriacao && (noticia.dataCriacao as Timestamp).toDate().toLocaleDateString('pt-BR') || "Data Indisponível"} · {noticia.autor || "Autor Desconhecido"}
                                            </p>
                                            <h3 className="text-xl font-semibold mb-2">
                                                {noticia.titulo}
                                            </h3>
                                            <p className="text-xs h-20 overflow-hidden text-ellipsis">
                                                {noticia.resumo}
                                            </p>
                                        </div>
                                        <a href={`/noticias/${noticia.id}`} className="text-palette-2 hover:text-palette-1 mt-2 justify-self-end">
                                            Ler mais →
                                        </a>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
                
                {loading && noticias.length > 0 && (
                    <p className="text-center text-gray-500 mt-8">Carregando mais notícias...</p>
                )}

                {hasMore && !loading && (
                    <button 
                        onClick={() => fetchNoticias()}
                        className="bg-palette-3 text-palette-5 py-2 px-4 rounded-full cursor-pointer hover:bg-palette-2 transition-colors ease-in-out duration-200 mt-8"
                    >
                        Ver mais notícias
                    </button>
                )}
                {!hasMore && !loading && noticias.length > 0 && (
                    <p className="text-center text-gray-500 mt-8">Você chegou ao final.</p>
                )}
            </div>
        </div>
    );
}
