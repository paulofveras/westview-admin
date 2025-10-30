import { Material } from "./material.model";
import { Fornecedor } from "./pessoa.model";

// Esta interface representa um objeto Quadrinho como ele vem do back-end.
// Note que ele inclui o objeto Fornecedor completo.
export interface Quadrinho {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    estoque: number;
    fornecedor?: Fornecedor | null;
    material?: Material | null;
    quantPaginas?: number;
    nomeImagem: string; // Nome do arquivo de imagem associado ao quadrinho
}