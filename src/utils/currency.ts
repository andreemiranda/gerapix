export const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

export const parseCurrency = (value: string) => {
  return parseFloat(value.replace(/\D/g, '')) / 100;
};
