export type PixKeyType = 'cpf_cnpj' | 'email' | 'telefone' | 'aleatoria';

export interface PixConfig {
  tipo_chave: PixKeyType;
  chave_pix: string;
  identificador: string;
  merchant_name?: string;
  merchant_city?: string;
  updatedAt?: any;
}

export interface AdminUser {
  uid: string;
  email: string;
  username: string;
  role: string;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  };
}
