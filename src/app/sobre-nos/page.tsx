// src/app/sobre-nos/page.tsx

import React from 'react';
import Image from 'next/image'; // Importa o componente Image do Next.js para otimização de imagens

export default function AboutPage() {
  return (
    <div className="min-h-screen flex justify-center">
      {/* O cabeçalho e o rodapé foram removidos daqui, pois são componentes globais */}
      <main className="size-control pb-12">
        {/* Seção de Título */}
        <section className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-palette-3 leading-tight mb-4">
            Apoio UFU: Combatendo o Racismo na Universidade
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Uma aplicação dedicada a facilitar denúncias de racismo e promover um ambiente acadêmico mais justo e inclusivo.
          </p>
        </section>

        {/* Seção Principal de Conteúdo */}
        <section className="bg-white my-24">
          <div className="flex flex-col md:flex-row items-center md:space-x-8">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold text-palette-3 mb-4">Nossa Missão</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                O Apoio UFU nasceu da crescente necessidade de uma abordagem mais eficaz para registrar e explorar incidentes de discriminação racial na Universidade Federal de Uberlândia (UFU). Nosso objetivo principal é facilitar o processo de denúncia, permitindo que alunos, professores e funcionários relatem incidentes de forma anônima ou identificada, garantindo segurança e confidencialidade.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Acreditamos que, ao simplificar o ato de denunciar, podemos não apenas tornar as ações de reclamação mais claras, mas também dar um passo adiante para estabelecer políticas de combate ao racismo na instituição, promovendo um ambiente educacional verdadeiramente favorável e equitativo.
              </p>
            </div>
            <div className="md:w-1/2">
              {/* Imagem relacionada ao tema, para ser adicionada à pasta public */}
              <Image
                src="/about-image.jpg" // Nome da imagem que você irá adicionar na pasta public
                alt="Pessoas de diversas etnias se unindo contra o racismo"
                width={600} // Ajuste conforme a necessidade
                height={400} // Ajuste conforme a necessidade
                className="rounded-2xl shadow-lg object-cover w-full h-auto"
              />
            </div>
          </div>
        </section>

        {/* Seção sobre a Importância da Ferramenta */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-palette-3 mb-6 text-center">Por Que o Apoio UFU É Importante?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Combate ao Racismo Estrutural</h3>
              <p className="text-gray-700">
                O racismo é uma realidade persistente em diversos setores, incluindo o educacional. O Apoio UFU atua como uma ferramenta vital para identificar padrões de discriminação e auxiliar na criação de políticas internas eficazes contra o racismo estrutural.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Anonimato e Segurança</h3>
              <p className="text-gray-700">
                Muitas vítimas de racismo temem represálias ao denunciar. Nossa plataforma garante o anonimato e a segurança dos dados, encorajando mais pessoas a relatarem incidentes e construindo um panorama mais completo das práticas racistas.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Dados para Ação</h3>
              <p className="text-gray-700">
                Além de coletar denúncias, o Apoio UFU gera relatórios gerenciais detalhados. Esses dados são cruciais para a universidade identificar fatores repetitivos de discriminação e implementar ações corretivas e proativas.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
