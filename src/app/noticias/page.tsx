"use client";

import React, { useEffect, useState } from 'react';
import { db } from '../../../lib/firebase';
import { collection, getDocs, orderBy, query, Timestamp } from "firebase/firestore";
import { Noticia } from '../../../types';

export default function NewsPage() {
    const [noticias, setNoticias] = useState<Noticia[]>([]);
    const [loading, setLoading] = useState(true);

    // URL base do Cloudinary. Substitua 'duu0fcbo7' pelo seu user-url, se necessário.
    const cloudinaryBaseUrl = "https://res.cloudinary.com/duu0fcbo7/image/fetch/";
    // Função para otimizar e redimensionar a imagem com Cloudinary
    const getOptimizedImageUrl = (url: string | undefined, width: number) => {
        // Se a URL já é do Cloudinary, extrai a parte da imagem e adiciona as transformações.
        // Se não, assume que é um URL completo e adiciona as transformações após a URL base.
        const imagePath = url?.includes(cloudinaryBaseUrl) ? url.split(cloudinaryBaseUrl)[1] : url;
        const transformacoes = `c_scale,w_${width},f_auto,q_auto`;
        return `${cloudinaryBaseUrl}${transformacoes}/${imagePath}`;
    };

    useEffect(() => {
        // Função assíncrona para buscar as notícias do Firestore
        const fetchNoticias = async () => {
            try {
                // Cria uma query para a coleção 'noticias' e ordena pelo campo 'dataCriacao' em ordem decrescente
                const noticiasQuery = query(collection(db, "noticias"), orderBy("dataCriacao", "desc"));
                const querySnapshot = await getDocs(noticiasQuery);

                // Mapeia os documentos do Firestore para um array de objetos
                const noticiasArray: Noticia[] = [];
                querySnapshot.forEach((doc) => {
                    noticiasArray.push({ ...doc.data(), id: doc.id } as Noticia);
                });
                
                setNoticias(noticiasArray);
            } catch (error) {
                console.error("Erro ao buscar notícias:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNoticias();
    }, []); // O array vazio [] garante que o useEffect rode apenas uma vez, na montagem do componente

    // Exibe o estado de carregamento
    if (loading) {
        return (
            <div className="w-full flex items-center justify-center min-h-[50vh] text-gray-500">
                Carregando notícias...
            </div>
        );
    }

    // Exibe uma mensagem se não houver notícias
    if (noticias.length === 0) {
        return (
            <div className="w-full flex items-center justify-center min-h-[50vh] text-gray-500">
                Nenhuma notícia encontrada.
            </div>
        );
    }

    // A primeira notícia será usada como o destaque, as demais no grid
    const noticiaDestaque = noticias[0];
    const outrasNoticias = noticias.slice(1);

    return (
        <div className="w-full flex items-center justify-center mb-24">
            <div className="size-control flex flex-col items-center justify-center gap-10">
                {/* Barra de Pesquisa (sem funcionalidade ainda) */}
                <div className="w-full relative">
                    <input
                        type="text"
                        placeholder="Pesquisar notícias..."
                        className="w-full p-3 rounded-xl border border-gray-300 focus:!outline-none focus:border-palette-2 transition-colors duration-200"
                    />
                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-palette-3 hover:text-palette-1 transition-colors duration-200">
                        <i className="fas fa-magnifying-glass"></i>
                    </button>
                </div>
                
                {/* Notícia de Destaque */}
                <div className="bg-palette-5 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col md:flex-row items-center justify-center w-full overflow-hidden">
                    <div className="w-full md:w-1/2 relative">
                        <img 
                            // Redimensiona a imagem usando Cloudinary
                            src={getOptimizedImageUrl(noticiaDestaque.imagem, 1200) || "https://placehold.co/1200x800/E5E7EB/4B5563?text=Imagem"} 
                            alt={noticiaDestaque.titulo} 
                            className="w-full object-cover rounded-t-xl md:rounded-l-xl md:rounded-t-none h-64 md:h-96" 
                        />
                        <div className="absolute bottom-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 rounded-tl-lg">
                            {noticiaDestaque.tag || "Sem Tag"}
                        </div>
                    </div>
                    <div className="flex flex-col items-start justify-between w-full md:w-1/2 p-6">
                        <p className="text-xs text-gray-500">
                            {noticiaDestaque.dataCriacao?.toDate().toLocaleDateString('pt-BR') || "Data Indisponível"} · {noticiaDestaque.autor || "Autor Desconhecido"}
                        </p>
                        <h1 className="text-xl md:text-2xl lg:text-4xl font-semibold mb-2">
                            {noticiaDestaque.titulo}
                        </h1>
                        <p className="text-sm h-auto md:h-20 overflow-hidden text-ellipsis">
                            {noticiaDestaque.resumo}
                        </p>
                        <a href={`/noticias/${noticiaDestaque.id}`} className="text-palette-2 hover:text-palette-1 mt-4">
                            Ler mais →
                        </a>
                    </div>
                </div>
                
                {/* Grid de Outras Notícias */}
                <div className="grid lg:grid-cols-4 lg:grid-rows-2 sm:grid-cols-2 sm:grid-rows-4 grid-cols-1 grid-rows-8 gap-5 w-full">
                    {outrasNoticias.map((noticia) => (
                        <div key={noticia.id} className="bg-palette-5 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-start justify-between overflow-hidden">
                            <div className="w-full relative">
                                <img 
                                    // Redimensiona a imagem usando Cloudinary
                                    src={getOptimizedImageUrl(noticia.imagem, 600) || "https://placehold.co/600x400/E5E7EB/4B5563?text=Imagem"} 
                                    alt={noticia.titulo} 
                                    className="w-full h-40 object-cover rounded-t-xl" 
                                />
                                <div className="absolute bottom-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 rounded-tl-lg">
                                    {noticia.tag || "Sem Tag"}
                                </div>
                            </div>
                            <div className="flex flex-col items-start justify-between w-full p-6 h-full">
                                <p className="text-xs text-gray-500">
                                    {noticia.dataCriacao?.toDate().toLocaleDateString('pt-BR') || "Data Indisponível"} · {noticia.autor || "Autor Desconhecido"}
                                </p>
                                <h3 className="text-xl font-semibold mb-2">
                                    {noticia.titulo}
                                </h3>
                                <p className="text-xs h-20 overflow-hidden text-ellipsis">
                                    {noticia.resumo}
                                </p>
                                <a href={`/noticias/${noticia.id}`} className="text-palette-2 hover:text-palette-1 mt-2">
                                    Ler mais →
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
                
                <button className="bg-palette-3 text-palette-5 py-2 px-4 rounded-full cursor-pointer hover:bg-palette-2 transition-colors ease-in-out duration-200">
                    Ver mais notícias
                </button>
            </div>
        </div>
    );
}
