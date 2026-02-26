export function formatCurrency(value) {
  const number = Number(value || 0);
  return number.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function formatDate(date) {
  if (!date) return '-';
  return new Date(date).toLocaleString('pt-BR');
}
