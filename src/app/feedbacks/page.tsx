// app/feedbacks/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../lib/AuthContext'; // Ajuste o caminho conforme a sua estrutura
import ProtectedPage from '../components/ProtectedPage';
import { db } from '../../../lib/firebase'; // Ajuste o caminho conforme a sua estrutura
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Feedback } from '../../../types'; // Ajuste o caminho conforme a sua estrutura de pastas
import moment from 'moment'; // Importe moment para formatação de data

const FeedbacksPage = () => {
  const { userData, loading: authLoading } = useAuth();
  const router = useRouter();

  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(true); // Estado de carregamento dos feedbacks
  const [error, setError] = useState<string | null>(null);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estados para ordenação
  const [sortKey, setSortKey] = useState<keyof Feedback>('timestamp'); // Chave padrão para ordenação
  const [sortOrder, setSortOrder] = useState('asc'); // Ordem padrão: decrescente para timestamp

  useEffect(() => {
    // Redirecionar se não for admin e a autenticação estiver carregada
    if (!authLoading && userData && userData.nivel_autorizacao !== 'admin') {
      router.push('/'); // Redireciona para a home ou uma página de acesso negado
      return;
    }

    // Apenas tenta buscar feedbacks se o usuário for admin e não estiver mais carregando a autenticação
    if (userData?.nivel_autorizacao === 'admin' && !authLoading) {
      const fetchFeedbacks = async () => {
        try {
          setLoadingFeedbacks(true); // Inicia o carregamento
          const feedbackCollectionRef = collection(db, 'feedbacks'); // Corrigido para 'feedback' conforme suas regras
          // A ordenação inicial na query do Firebase pode ser útil para grandes conjuntos de dados,
          // mas a ordenação final será feita no cliente.
          // const q = query(feedbackCollectionRef, orderBy('timestamp', 'desc')); // Removido para usar ordenação local apenas
          const querySnapshot = await getDocs(feedbackCollectionRef); // Buscar sem orderBy aqui

          const fetchedFeedbacks: Feedback[] = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Feedback[];
          setFeedbacks(fetchedFeedbacks);
        } catch (err) {
          console.error("Erro ao carregar feedbacks:", err);
          setError("Ocorreu um erro ao carregar os feedbacks.");
        } finally {
          setLoadingFeedbacks(false); // Finaliza o carregamento
        }
      };
      fetchFeedbacks();
    }
  }, [userData, authLoading, router]); // Dependências para re-executar o efeito

  // Lógica para ordenação da tabela
  const sortedFeedbacks = [...feedbacks].sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];

    // Lidar com valores de data (Firebase Timestamp)
    if (sortKey === 'timestamp' && aValue && bValue && (aValue as any).toDate && (bValue as any).toDate) {
      const dateA = (aValue as any).toDate().getTime();
      const dateB = (bValue as any).toDate().getTime();
      if (dateA < dateB) return sortOrder === 'asc' ? -1 : 1;
      if (dateA > dateB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    }

    // Lidar com outros tipos de string/number
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  const handleSort = (key: keyof Feedback) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc'); // Reinicia para 'asc' ao mudar a coluna de ordenação
    }
  };

  const handleViewFeedback = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFeedback(null);
  };

  // Renderiza um estado de carregamento enquanto a autenticação ou os feedbacks estão sendo carregados
  if (authLoading || loadingFeedbacks) {
    return (
      <ProtectedPage requiredRole="admin">
        <div className="flex justify-center items-center h-screen">
          <p className="text-xl">Carregando feedbacks...</p>
        </div>
      </ProtectedPage>
    );
  }
  
  // Se o usuário não for admin após o carregamento (e o ProtectedPage não tiver redirecionado ainda),
  // esta verificação extra impede a renderização do conteúdo.
  if (!userData || userData.nivel_autorizacao !== 'admin') {
    return null; 
  }

  // Exibe mensagem de erro se houver falha no carregamento dos feedbacks
  if (error) {
    return (
      <ProtectedPage requiredRole="admin">
        <div className="flex justify-center items-center h-screen">
          <p className="text-red-500 text-xl">{error}</p>
        </div>
      </ProtectedPage>
    );
  }

  return (
    <ProtectedPage requiredRole="admin">
      <div className="size-control mb-16 pt-24"> {/* Adicionado pt-24 para compensar o header fixo */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Feedbacks Recebidos</h1>

        {feedbacks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center text-gray-600">
            <i className="fa-solid fa-comment-dots text-6xl mb-4 text-palette-4"></i>
            <p className="text-xl font-semibold">Nenhum feedback encontrado ainda.</p>
            <p className="mt-2">Seus usuários podem enviar sugestões através do botão flutuante.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-palette-1">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('type')}
                  >
                    Tipo
                    {sortKey === 'type' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('feedback')}
                  >
                    Mensagem (Resumo)
                    {sortKey === 'feedback' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('contact')}
                  >
                    Email de Contato
                    {sortKey === 'contact' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('timestamp')}
                  >
                    Enviado em
                    {sortKey === 'timestamp' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Visualizar</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedFeedbacks.map((feedback) => (
                  <tr key={feedback.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${feedback.type === 'melhoria' ? 'bg-blue-100 text-blue-800' :
                           feedback.type === 'critica' ? 'bg-red-100 text-red-800' :
                           'bg-green-100 text-green-800'} capitalize`}>
                        {feedback.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 truncate max-w-xs">
                        {feedback.feedback}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {feedback.contact || 'N/A'} {/* Adicionado N/A para contato opcional */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {feedback.timestamp?.toDate ? 
                        moment(feedback.timestamp.toDate()).format('DD/MM/YYYY HH:mm') : 
                        'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleViewFeedback(feedback)}
                        className="text-palette-2 hover:text-palette-3 transition-colors duration-200 cursor-pointer"
                      >
                        Visualizar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL DE VISUALIZAÇÃO DO FEEDBACK (integrado aqui) */}
      {isModalOpen && selectedFeedback && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-gray-900/75">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4 transform transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Detalhes do Feedback</h2>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700 cursor-pointer">
                <i className="fa-solid fa-xmark h-6 w-6"></i>
              </button>
            </div>

            <div className="space-y-4 text-gray-700">
              <div>
                <p className="font-semibold text-lg">Tipo:</p>
                <span className="inline-block bg-palette-4 text-white text-sm px-3 py-1 rounded-full capitalize">
                  {selectedFeedback.type}
                </span>
              </div>
              <div>
                <p className="font-semibold text-lg">Mensagem:</p>
                <p className="bg-gray-100 p-3 rounded-md border border-gray-200 whitespace-pre-wrap">
                  {selectedFeedback.feedback}
                </p>
              </div>
              {selectedFeedback.contact && (
                <div>
                  <p className="font-semibold text-lg">Contato:</p>
                  <p className="text-gray-800">{selectedFeedback.contact}</p>
                </div>
              )}
              <div>
                <p className="font-semibold text-lg">Enviado em:</p>
                <p className="text-gray-800">
                  {selectedFeedback.timestamp?.toDate ? 
                    moment(selectedFeedback.timestamp.toDate()).format('DD/MM/YYYY [às] HH:mm') : 
                    'N/A'}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleCloseModal}
                className="bg-palette-2 text-white px-6 py-2 rounded-md hover:bg-palette-3 transition-colors duration-200 cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </ProtectedPage>
  );
};

export default FeedbacksPage;
