import { PixKeyType } from '../types';

export function validatePixKey(tipo: PixKeyType, chave: string): boolean {
  if (!chave) return false;
  const cleanChave = chave.trim();

  switch (tipo) {
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanChave);
    case 'telefone': {
      const nums = cleanChave.replace(/\D/g, '');
      return nums.length >= 10 && nums.length <= 11;
    }
    case 'cpf_cnpj': {
      const nums = cleanChave.replace(/\D/g, '');
      return nums.length === 11 || nums.length === 14;
    }
    case 'aleatoria':
      return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanChave);
    default:
      return false;
  }
}
