'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { db } from '../../lib/firebase';
import { collection, getDocs, orderBy, query, Timestamp, where } from "firebase/firestore"; // Re-adicionado query e where
import { Noticia } from '../../types';

const HomePage = () => {
    const [noticias, setNoticias] = useState<Noticia[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNoticias = async () => {
            try {
                const noticiasCollectionRef = collection(db, "noticias");
                
                // Modificado para buscar apenas notícias publicadas e ordenadas
                const q = query(
                    noticiasCollectionRef,
                    where("status", "==", "published"),
                    orderBy("dataCriacao", "desc")
                );
                
                const querySnapshot = await getDocs(q);

                const fetchedNoticias: Noticia[] = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id
                })) as Noticia[];
                
                setNoticias(fetchedNoticias);
            } catch (error) {
                console.error("Erro ao buscar notícias:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNoticias();
    }, []);

    if (loading) {
        return (
            <div className="w-full flex items-center justify-center min-h-screen text-gray-500 bg-palette-5">
                Carregando notícias...
            </div>
        );
    }
    
    const noticiaDestaque = noticias[0];
    const outrasNoticias = noticias.slice(1, 9); // Pega as 8 notícias seguintes para o grid

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-palette-5 text-palette-3">

            {/* banner */}
            <div className="size-control flex items-center justify-center">
                <div className="w-full md:h-[500px] bg-[url('/silence-is-violence.jpg')] bg-size-[auto_250%] bg-position-[left_42%_bottom_35%] md:bg-position-[left_60%_center] lg:bg-position-[left_70%_center] rounded-4xl shadow-lg overflow-hidden">
                    <div className="bg-linear-to-t md:bg-linear-to-l from-palette-3 to-transparent from-20% md:from-10% h-full w-full text-center pt-96 md:pt-0 md:text-end flex flex-col items-center md:items-end justify-center text-palette-5 p-12 gap-10">
                        <h1 className="text-6xl font-semibold">Silêncio é Violência!</h1>
                        <p className="max-w-96">Não fique em <b>silêncio</b> diante da opressão. Sua voz é importante! Aprenda a se manifestar ou entre em contato com a gente.</p>
                        <div className="flex items-center justify-end gap-5">
                            <button className="bg-transparent border-2 border-palette-5 text-palette-5 py-2 px-4 rounded-full cursor-pointer hover:bg-palette-5 hover:text-palette-3 transition-colors ease-in-out duration-200">Fazer uma denúncia</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* noticias */}
            <div className="w-full flex items-center justify-center my-16">
                <div className="size-control flex flex-col items-center justify-center gap-10">
                    <h2 className="text-4xl font-semibold">Últimas Notícias</h2>
                    
                    {noticias.length === 0 ? (
                        <div className="w-full flex items-center justify-center min-h-[50vh] text-gray-500">
                            Nenhuma notícia encontrada.
                        </div>
                    ) : (
                        <>
                            {/* Notícia de Destaque */}
                            {noticiaDestaque && (
                                <div className="bg-palette-5 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col md:flex-row items-center justify-center w-full overflow-hidden">
                                    <div className="w-full md:w-1/2 relative">
                                        <Image 
                                            src={noticiaDestaque.imagem || "https://placehold.co/1200x800/E5E7EB/4B5563?text=Imagem"} 
                                            alt={noticiaDestaque.titulo} 
                                            className="w-full object-cover rounded-t-xl md:rounded-l-xl md:rounded-t-none h-64 md:h-96" 
                                            width={1200}
                                            height={800}
                                        />
                                        <div className="absolute bottom-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 rounded-tl-lg">
                                            {noticiaDestaque.tag || "Sem Tag"}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-start justify-start w-full md:w-1/2 p-6">
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
                            
                            {/* Grid de Outras Notícias */}
                            <div className="grid lg:grid-cols-4 lg:grid-rows-2 sm:grid-cols-2 sm:grid-rows-4 grid-cols-1 grid-rows-8 gap-5 w-full">
                                {outrasNoticias.map((noticia) => (
                                    <div key={noticia.id} className="bg-palette-5 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-start justify-between overflow-hidden">
                                        <div className="w-full relative">
                                            <Image 
                                                src={noticia.imagem || "https://placehold.co/600x400/E5E7EB/4B5563?text=Imagem"} 
                                                alt={noticia.titulo} 
                                                className="w-full h-40 object-cover rounded-t-xl" 
                                                width={600}
                                                height={400}
                                            />
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
                                            <a href={`/noticia/${noticia.slug}`} className="text-palette-2 hover:text-palette-1 mt-2 justify-self-end">
                                                Ler mais →
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Botão para ver mais notícias */}
                            <a href="/noticias" className="bg-palette-3 text-palette-5 py-2 px-4 rounded-full cursor-pointer hover:bg-palette-2 transition-colors ease-in-out duration-200">
                                Ver mais notícias
                            </a>
                        </>
                    )}
                </div>
            </div>

            {/* banner final */}
            <div className="size-control flex items-center justify-center my-16">
                <div className="w-full bg-size-cover bg-position-center rounded-4xl shadow-lg overflow-hidden">
                    <div className="bg-palette-3 h-full w-full flex lg:flex-row flex-col items-center justify-between text-palette-5 p-10 gap-5">
                        <div className="lg:w-2/5 sm:w-2/3 w-full">
                            <Image
                                src="/banner-final.png"
                                alt="Cards Banner Final"
                                width={500}
                                height={300}
                                className="w-full"
                            />
                        </div>
                        <div className="flex flex-col items-center lg:items-end justify-between w-full gap-5 lg:text-end text-center">
                            <h2 className="text-4xl font-semibold">Juntos somos mais fortes!</h2>
                            <p>Apoie a luta contra o racismo e a opressão no ambiente universitário. Cada denúncia e ato de solidariedade são cruciais para desmantelar preconceitos e construir uma comunidade acadêmica justa. Sua participação é fundamental: ela empodera vozes e inspira a mudança.</p>
                            <button className="bg-palette-5 text-palette-3 py-2 px-4 rounded-full cursor-pointer hover:bg-palette-1 transition-colors ease-in-out duration-200">Denunciar</button>
                        </div>          
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
