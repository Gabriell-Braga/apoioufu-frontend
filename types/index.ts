import { FieldValue } from "firebase/firestore";

export interface Noticia {
    id: string;
    titulo: string;
    resumo: string;
    conteudo?: string;
    autor?: string;
    dataCriacao?: { toDate: () => Date } | FieldValue; // Lida com o formato Timestamp do Firestore
    tag?: string;
    imagem?: string;
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