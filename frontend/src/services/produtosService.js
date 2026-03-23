import request from './api'

export const listarProdutos = async () => request('/produtos')

export const criarProduto = async (produto) =>
  request('/produtos', {
    method: 'POST',
    body: JSON.stringify(produto),
  })

export const atualizarProduto = async (id, produto) =>
  request(`/produtos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(produto),
  })

export const excluirProduto = async (id) =>
  request(`/produtos/${id}`, {
    method: 'DELETE',
  })
