// Modelos compartilhados para pessoas, endereços, telefones e usuários

export interface Telefone {
  codigoArea: string;
  numero: string;
}

export interface Endereco {
  cep: number;
  rua: string;
  numero: number;
}

// Resposta retornada pelo backend em fluxos de autenticação ou associações
export interface UsuarioResponse {
  id?: number;
  username: string;
  nome?: string;
  perfil?: string;
}

// Representa itens retornados pela listagem /usuarios
export interface UsuarioListItem {
  id: number;
  username: string;
}

export interface Fornecedor {
  id: number;
  nome: string;
  nomeFantasia: string;
  cnpj: string;
  email: string;
  telefone: Telefone;
  endereco: Endereco;
}

export interface Cliente {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  username?: string;
  senha?: string;
  telefone: Telefone;
  endereco: Endereco;
  usuario?: UsuarioResponse;
}

export interface Funcionario {
  id: number;
  nome: string;
  cpf: string;
  cargo: string;
  email: string;
  username?: string;
  senha?: string;
  telefone: Telefone;
  endereco: Endereco;
  usuario?: UsuarioResponse;
}

export interface Administrador {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  cargo: string;
  nivelAcesso: string;
  username?: string;
  senha?: string;
  telefone: Telefone;
  endereco: Endereco;
  usuario?: UsuarioResponse;
}
