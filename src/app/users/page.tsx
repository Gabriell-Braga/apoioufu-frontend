// src/app/users/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onSnapshot, collection, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../../lib/AuthContext'; // Importa o hook do seu contexto
import ProtectedPage from '../components/ProtectedPage'; // Importa o componente de proteção de página
import { db } from '../../../lib/firebase'; // Importa o db diretamente do arquivo de configuração
import { UserDataType, EditUserModalProps } from '../../../types'; // Importa os tipos definidos

// ----------------------------------------------------------------------------------
// COMPONENTES DE UI DA PÁGINA
// ----------------------------------------------------------------------------------

const EditUserModal = ({ user, onClose, onSave }: EditUserModalProps) => {
    const [name, setName] = useState(user.nome);
    const [surname, setSurname] = useState(user.sobrenome);
    const [role, setRole] = useState(user.nivel_autorizacao);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        await onSave(user.id, { nome: name, sobrenome: surname, nivel_autorizacao: role });
        setIsSaving(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
                <h2 className="text-2xl font-bold mb-4">Editar Usuário</h2>
                <form onSubmit={handleSave}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="text"
                            value={user.email}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                            disabled
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Nome</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-2"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Sobrenome</label>
                        <input
                            type="text"
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-2"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700">Nível de Autorização</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-2"
                        >
                            <option value="sem_autorizacao">Sem Autorização</option>
                            <option value="escritor">Escritor</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 transition"
                            disabled={isSaving}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-palette-2 text-white py-2 px-4 rounded-md hover:bg-palette-3 transition disabled:opacity-50 cursor-pointer"
                            disabled={isSaving}
                        >
                            {isSaving ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ----------------------------------------------------------------------------------
// PÁGINA PRINCIPAL DE USUÁRIOS
// ----------------------------------------------------------------------------------

function UsersPage() {
    const { user, userData } = useAuth();
    const [users, setUsers] = useState<UserDataType[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [sortKey, setSortKey] = useState<keyof UserDataType>('nome');
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' ou 'desc'
    const [editUser, setEditUser] = useState<UserDataType | null>(null); // Estado para o modal de edição

    // Lógica para buscar usuários em tempo real
    useEffect(() => {
        // Redireciona se o usuário não for um admin
        if (userData?.nivel_autorizacao !== 'admin') {
            return;
        }

        const usersCollectionRef = collection(db, 'users');
        const unsubscribe = onSnapshot(usersCollectionRef, (querySnapshot) => {
            const usersData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(usersData as UserDataType[]);
            setLoadingUsers(false);
        }, (error) => {
            console.error("Erro ao buscar usuários:", error);
            setLoadingUsers(false);
        });

        return () => unsubscribe();
    }, [userData]);

    // Lógica para ordenação da tabela
    const sortedUsers = [...users].sort((a, b) => {
        const aValue = a[sortKey];
        const bValue = b[sortKey];

        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const handleSort = (key: string) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key as keyof UserDataType);
            setSortOrder('asc');
        }
    };

    // Função para salvar as edições de um usuário
    const handleSaveUser = async (userId: string, data: { nome: string, sobrenome: string, nivel_autorizacao: string }) => {
        try {
            const userDocRef = doc(db, 'users', userId);
            await updateDoc(userDocRef, data);
            console.log(`Usuário ${userId} atualizado com sucesso!`);
        } catch (error) {
            console.error("Erro ao atualizar o usuário:", error);
        }
    };

    return (
        <ProtectedPage requiredRole="admin">
            <div className="size-control p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Gerenciamento de Usuários</h1>

                <div className="bg-white shadow-lg rounded-lg p-6">
                    {loadingUsers ? (
                        <p className="text-gray-600">Carregando usuários...</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                            onClick={() => handleSort('nome')}
                                        >
                                            Nome
                                            {sortKey === 'nome' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                                        </th>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                            onClick={() => handleSort('email')}
                                        >
                                            Email
                                            {sortKey === 'email' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                                        </th>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                            onClick={() => handleSort('nivel_autorizacao')}
                                        >
                                            Autorização
                                            {sortKey === 'nivel_autorizacao' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {sortedUsers.map(mappedUser => {
                                        const isCurrentUser = user && mappedUser.id === user.uid;
                                        const isBaseAdmin = mappedUser.email === 'admin@apoioufu.com';
                                        
                                        return (
                                            <tr key={mappedUser.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">{mappedUser.nome} {mappedUser.sobrenome}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{mappedUser.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        mappedUser.nivel_autorizacao === 'admin' ? 'bg-indigo-100 text-indigo-800' :
                                                        mappedUser.nivel_autorizacao === 'escritor' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {mappedUser.nivel_autorizacao}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    {/* O botão é exibido apenas se não for o usuário logado nem o admin principal */}
                                                    {(!isCurrentUser && !isBaseAdmin) && (
                                                        <button
                                                            onClick={() => setEditUser(mappedUser)}
                                                            className="text-palette-2 hover:text-palette-3 cursor-pointer transition-colors duration-200"
                                                        >
                                                            Editar
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de edição de usuário */}
            {editUser && (
                <EditUserModal
                    user={editUser}
                    onClose={() => setEditUser(null)}
                    onSave={handleSaveUser}
                />
            )}
        </ProtectedPage>
    );
}

export default UsersPage;
