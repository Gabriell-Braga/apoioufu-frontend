'use client';

import React, { useEffect, useState, useRef } from 'react';
import { db } from '../../../lib/firebase';
import { collection, getDocs, orderBy, query, Timestamp, where } from "firebase/firestore";
import { Noticia } from '../../../types';
import Image from 'next/image';

export default function NewsPage() {
    const [noticias, setNoticias] = useState<Noticia[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [allNoticias, setAllNoticias] = useState<Noticia[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchAllNoticias = async () => {
            try {
                setLoading(true);
                const q = query(
                    collection(db, "noticias"),
                    where("status", "==", "published"),
                    orderBy("dataCriacao", "desc")
                );
                const querySnapshot = await getDocs(q);
                const fetchedAllNoticias = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id
                })) as Noticia[];

                setAllNoticias(fetchedAllNoticias);
            } catch (error) {
                console.error("Erro ao buscar notícias:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllNoticias();
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = () => {
        if (inputRef.current) {
            inputRef.current.focus(); // Mantém o foco no input
        }
        // A lógica de pesquisa já é feita automaticamente pelo `filteredNoticias`
    };

    const filteredNoticias = allNoticias.filter(noticia =>
        noticia.titulo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="w-full flex items-center justify-center min-h-[50vh] text-gray-500">
                Carregando notícias...
            </div>
        );
    }
    
    if (filteredNoticias.length === 0) {
        return (
            <div className="w-full flex flex-col items-center justify-start min-h-[50vh] text-gray-500">
                <div className="w-full size-control relative mb-6">
                    <input
                        type="text"
                        placeholder="Pesquisar notícias..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full p-3 rounded-xl border border-gray-300 focus:!outline-none focus:border-palette-2 transition-colors duration-200"
                        ref={inputRef}
                    />
                    <button onClick={handleSearchSubmit} className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-palette-3 hover:text-palette-1 transition-colors duration-200">
                        <i className="fas fa-magnifying-glass"></i>
                    </button>
                </div>
                <p>Nenhuma notícia encontrada para o termo "{searchTerm}".</p>
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
                        ref={inputRef}
                    />
                    <button onClick={handleSearchSubmit} className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-palette-3 hover:text-palette-1 transition-colors duration-200">
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
                            return (
                                <div 
                                    key={noticia.id} 
                                    className="bg-palette-5 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-start justify-between overflow-hidden"
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
                                        <p className="text-xs text-gray-500">
                                            {noticia.dataCriacao && (noticia.dataCriacao as Timestamp).toDate().toLocaleDateString('pt-BR') || "Data Indisponível"} · {noticia.autor || "Autor Desconhecido"}
                                        </p>
                                        <h3 className="text-xl font-semibold mb-2">
                                            {noticia.titulo}
                                        </h3>
                                        <p className="text-xs h-20 overflow-hidden text-ellipsis">
                                            {noticia.resumo}
                                        </p>
                                        <a href={`/noticia/${noticia.slug}`} className="text-palette-2 hover:text-palette-1 mt-2">
                                            Ler mais →
                                        </a>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
