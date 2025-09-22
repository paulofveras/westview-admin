// Define as estruturas básicas que serão aninhadas em outros modelos.
export interface Telefone {
    codigoArea: string;
    numero: string;
}

export interface Endereco {
    cep: number;
    rua: string;
    numero: number;
}

// Modelo para a resposta do login
export interface UsuarioResponse {
    username: string;
    nome: string;
}

// Modelo para Fornecedor (Pessoa Jurídica)
export interface Fornecedor {
    id: number;
    nome: string; // Razão Social
    nomeFantasia: string;
    cnpj: string;
    email: string;
    telefone: Telefone;
    endereco: Endereco;
}

// Modelo para Cliente (Pessoa Física)
export interface Cliente {
    id: number;
    nome: string;
    cpf: string;
    email: string;
    username: string;
    senha?: string; // Senha é opcional na resposta, mas obrigatória no envio
    telefone: Telefone;
    endereco: Endereco;
    usuario: UsuarioResponse;
}

// Modelo para Funcionário (Pessoa Física)
export interface Funcionario {
    id: number;
    nome: string;
    cpf: string;
    cargo: string;
    email: string;
    username: string;
    senha?: string;
    telefone: Telefone;
    endereco: Endereco;
    usuario: UsuarioResponse;
}