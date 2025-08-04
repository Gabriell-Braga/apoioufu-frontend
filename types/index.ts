export interface Noticia {
    id: string;
    titulo: string;
    resumo: string;
    conteudo?: string;
    autor?: string;
    dataCriacao?: { toDate: () => Date }; // Lida com o formato Timestamp do Firestore
    tag?: string;
    imagem?: string;
}