// src/app/denunciar/page.tsx

import React from 'react';

export default function ReportPage() {
    return (
        <div className="size-control flex flex-col items-center justify-center p-8 mb-24">
            <h1 className="text-5xl font-extrabold text-palette-3 leading-tight mb-4">Como realizar uma denúncia?</h1>
            <p className="text-lg text-gray-700">Todas as denúncias de instituições federais, como a UFU, devem ser feitas pelo portal Fala.BR do Governo Federal, a partir do qual você pode seguir as instruções para registrar sua denúncia de forma anônima e segura.</p>
            <div className='w-full'>
                <h2 className="text-3xl font-semibold mt-8">Passo a passo</h2>
                <ol className="list-decimal list-inside mt-2 text-lg">
                    <li>Acesse o portal <a href="https://falabr.cgu.gov.br/web" target="_blank" rel="noopener noreferrer" className='text-palette-1 hover:text-palette-4 font-semibold'>Fala.BR</a>.</li>
                    <li>Entre em 'Ouvidoria'.</li>
                    <li>Escolha a opção de 'Denúncia'.</li>
                    <li>Escolha o tipo de denúncia desejado e adequado para o seu caso.</li>
                    <li>Preencha os campos obrigatórios, fornecendo o máximo de detalhes possível.</li>
                    <li>Revise as informações e envie sua denúncia.</li>
                </ol>
            </div>
            <div className="mt-8">
                <a href="https://falabr.cgu.gov.br/web" target="_blank" rel="noopener noreferrer" className="bg-palette-3 text-palette-5 py-2 px-4 rounded-full cursor-pointer hover:bg-palette-2 transition-colors ease-in-out duration-200">
                    Acessar Fala.BR
                </a>
            </div>
        </div>
    );
}