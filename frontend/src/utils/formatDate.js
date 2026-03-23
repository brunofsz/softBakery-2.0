export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("pt-BR");
}

export const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString("pt-BR");
}
