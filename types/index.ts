import { FieldValue } from "firebase/firestore";

export interface Noticia {
    id: string;
    titulo: string;
    slug?: string;
    resumo: string;
    conteudo?: string;
    autor?: string;
    autorId?: string;
    dataCriacao?: { toDate: () => Date } | FieldValue; // Lida com o formato Timestamp do Firestore
    dataAtualizacao?: { toDate: () => Date } | FieldValue; // Lida com o formato Timestamp do Firestore
    tag?: string;
    imagem?: string;
    status?: 'draft' | 'published'; // Novo campo para o status da notícia
}

export interface UserDataType {
    id: string;
    nome: string;
    sobrenome: string;
    email: string;
    nivel_autorizacao: string;
    [key: string]: any; // Permite chaves adicionais dinâmicas
}

export interface EditUserModalProps {
    user: UserDataType;
    onClose: () => void;
    onSave: (userId: string, data: { nome: string, sobrenome: string, nivel_autorizacao: string }) => Promise<void>;
}