// src/app/noticias/page.tsx

import React from 'react';

export default function NewsPage() {
    return (
        <div className="w-full flex items-center justify-center mb-24">
            <div className="size-control flex flex-col items-center justify-center gap-10">
                {/* Search Bar */}
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
                <div className="bg-palette-5 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex items-center justify-center w-full overflow-hidden">
                    <div className="w-full relative aspect-video">
                        <img src={`/noticia-1.jpg`} alt={`Notícia 1`} className="w-full h-40 object-cover rounded-t-lg mb-4" />
                        <div className="absolute bottom-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 rounded-tl-lg">
                            Tag
                        </div>
                    </div>
                    <div className="flex flex-col items-start justify-between w-full p-6">
                        <p className="text-xs text-gray-500">March 20 2015 · Autor</p>
                        <h1 className="text-4xl font-semibold mb-2">Notícia 1</h1>
                        <p className="text-sm h-20">Descrição breve da notícia.</p>
                        <a href="" className="text-palette-2 hover:text-palette-1">Ler mais →</a>
                    </div>
                </div>
                <div className="grid lg:grid-cols-4 lg:grid-rows-2 sm:grid-cols-2 sm:grid-rows-4 grid-cols-1 grid-rows-8 gap-5 w-full">
                    {/* Exemplo de cards de notícias */}
                    {[...Array(8)].map((_, index) => (
                        <div key={index} className="bg-palette-5 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-start justify-center overflow-hidden">
                            <div className="w-full relative">
                                <img src={`/noticia-${index + 2}.jpg`} alt={`Notícia ${index + 2}`} className="w-full h-40 object-cover rounded-lg mb-4" />
                                <div className="absolute bottom-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 rounded-tl-lg">
                                    Tag
                                </div>
                            </div>
                            <div className="flex flex-col items-start justify-between w-full p-6">
                                <p className="text-xs text-gray-500">March 20 2015 · Autor</p>
                                <h3 className="text-2xl font-semibold mb-2">Notícia {index + 2}</h3>
                                <p className="text-xs h-20">Descrição breve da notícia.</p>
                                <a href="" className="text-palette-2 hover:text-palette-1">Ler mais →</a>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="bg-palette-3 text-palette-5 py-2 px-4 rounded-full cursor-pointer hover:bg-palette-2 transition-colors ease-in-out duration-200">Ver mais notícias</button>
            </div>
        </div>
    );
}