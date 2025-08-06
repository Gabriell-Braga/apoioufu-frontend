'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { db } from '../../../../lib/firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { Noticia } from '../../../../types';
import Image from 'next/image';
import { useAuth } from '../../../../lib/AuthContext';

export default function NoticiaPage() {
    const params = useParams();
    const slug = params.slug as string;
    // NOVO: Pega o estado de loading do useAuth
    const { userData, loading: authLoading } = useAuth();
    const user = useAuth().user;

    const [noticia, setNoticia] = useState<Noticia | null>(null);
    const [relatedNoticias, setRelatedNoticias] = useState<Noticia[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Variáveis de permissão, só serão válidas após authLoading ser falso
    const userRole = userData?.nivel_autorizacao;
    const currentUserId = user?.uid;

    useEffect(() => {
        if (!slug) return;

        const fetchNoticiaAndRelated = async () => {
            try {
                // Busca a notícia principal
                const q = query(collection(db, "noticias"), where("slug", "==", slug));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const doc = querySnapshot.docs[0];
                    const mainNoticia = { ...doc.data(), id: doc.id } as Noticia;

                    // CORREÇÃO: A verificação de permissão só ocorre após o authLoading ser falso
                    // Isso garante que userRole e currentUserId já estejam definidos
                    const isPublished = mainNoticia.status === 'published';
                    const isAdmin = userRole === 'admin';
                    const isAuthor = mainNoticia.autorId === currentUserId;

                    if (isPublished || isAdmin || isAuthor) {
                        setNoticia(mainNoticia);
                        
                        // Busca de notícias relacionadas de forma independente
                        const allNoticiasQuery = query(collection(db, "noticias"), where("status", "==", "published"));
                        const allNoticiasSnapshot = await getDocs(allNoticiasQuery);
                        
                        const allNoticias = allNoticiasSnapshot.docs.map(d => ({ ...d.data(), id: d.id } as Noticia));
                        
                        // Filtra, randomiza e pega 3 notícias que não sejam a atual
                        const filtered = allNoticias.filter(n => n.slug !== slug);
                        const shuffled = filtered.sort(() => 0.5 - Math.random());
                        setRelatedNoticias(shuffled.slice(0, 3));
                    } else {
                        setError("Você não tem permissão para visualizar esta notícia.");
                    }
                } else {
                    setError("Notícia não encontrada.");
                }
            } catch (err) {
                console.error("Erro ao buscar notícia:", err);
                setError("Ocorreu um erro ao carregar a notícia.");
            } finally {
                setLoading(false);
            }
        };

        // Só executa a busca se o authLoading for falso (usuário carregado ou não)
        if (!authLoading) {
            fetchNoticiaAndRelated();
        }
    }, [slug, userRole, currentUserId, authLoading]); // Adiciona authLoading como dependência

    if (loading || authLoading) { // Mostra carregamento se a notícia ou a autenticação estiverem carregando
        return (
            <div className="w-full flex items-center justify-center min-h-[50vh] text-gray-500">
                Carregando notícia e permissões...
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full flex items-center justify-center min-h-[50vh] text-red-500">
                {error}
            </div>
        );
    }

    if (!noticia) { // Se não houver notícia e não houver erro, significa que não foi encontrada
        return (
            <div className="w-full flex items-center justify-center min-h-[50vh] text-gray-500">
                Notícia não encontrada.
            </div>
        );
    }

    return (
        <div className="w-full flex items-center justify-center mb-16">
            <div className="size-control flex flex-col items-start justify-center gap-6">
                <div className="w-full flex items-center justify-between">
                    <p className='bg-black rounded-md py-1 px-2 text-white'>{noticia.tag || "Tag Indisponível"}</p>
                    <p className="text-sm text-gray-500">
                        {noticia.dataCriacao && (noticia.dataCriacao as Timestamp).toDate().toLocaleDateString('pt-BR') || "Data Indisponível"} · {noticia.autor || "Autor Desconhecido"}
                    </p>
                </div>                
                
                {noticia.imagem && (
                    <div className="w-full relative h-[250px] md:h-[700px] mb-6 rounded-xl overflow-hidden shadow-lg">
                        <Image
                            src={noticia.imagem}
                            alt={noticia.titulo}
                            layout="fill"
                            objectFit="cover"
                            objectPosition='center center'
                        />
                    </div>
                )}

                <h1 className="text-3xl md:text-5xl font-bold mb-4">{noticia.titulo}</h1>
                <p className="text-xl italic text-gray-600 mb-4">{noticia.resumo}</p>
                
                <div 
                    className="content-style max-w-none" 
                    dangerouslySetInnerHTML={{ __html: noticia.conteudo || '' }} 
                />

                {relatedNoticias.length > 0 && (
                    <div className="mt-16 w-full">
                        <h2 className="text-2xl font-bold mb-6">Notícias Relacionadas</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedNoticias.map((relatedNoticia) => (
                                <div key={relatedNoticia.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-start justify-between overflow-hidden">
                                    <div className="w-full relative">
                                        {relatedNoticia.imagem && (
                                            <Image 
                                                src={relatedNoticia.imagem} 
                                                alt={relatedNoticia.titulo} 
                                                className="w-full h-40 object-cover rounded-t-xl" 
                                                width={600}
                                                height={400}
                                            />
                                        )}
                                        <div className="absolute bottom-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 rounded-tl-lg">
                                            {relatedNoticia.tag || "Sem Tag"}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-start justify-between w-full p-6 h-full">
                                        <p className="text-xs text-gray-500">
                                            {relatedNoticia.dataCriacao && (relatedNoticia.dataCriacao as Timestamp).toDate().toLocaleDateString('pt-BR') || "Data Indisponível"} · {relatedNoticia.autor || "Autor Desconhecido"}
                                        </p>
                                        <h3 className="text-xl font-semibold mb-2 text-palette-3">
                                            {relatedNoticia.titulo}
                                        </h3>
                                        <p className="text-xs h-20 overflow-hidden text-ellipsis">
                                            {relatedNoticia.resumo}
                                        </p>
                                        <a href={`/noticia/${relatedNoticia.slug}`} className="text-palette-2 hover:text-palette-1 mt-2">
                                            Ler mais →
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            
            <style>{`
                .content-style h1, .content-style h2, .content-style h3 {
                    font-weight: bold;
                    margin-top: 1.5rem;
                    margin-bottom: 1rem;
                }
                .content-style h1 {
                    font-size: 2.25rem;
                }
                .content-style h2 {
                    font-size: 1.875rem;
                }
                .content-style h3 {
                    font-size: 1.5rem;
                }
                .content-style p {
                    margin-bottom: 1rem;
                    line-height: 1.625;
                }
                .content-style ul, .content-style ol {
                    margin-bottom: 1rem;
                    padding-left: 1.5rem;
                }
                .content-style ul {
                    list-style-type: disc;
                }
                .content-style ol {
                    list-style-type: decimal;
                }
                .content-style li {
                    margin-bottom: 0.5rem;
                }
                .content-style a {
                    color: #3b82f6; /* Tailwind blue-500 */
                    text-decoration: underline;
                }
                .content-style img {
                    margin-top: 2rem;
                    margin-bottom: 2rem;
                }
            `}</style>
        </div>
    );
}
