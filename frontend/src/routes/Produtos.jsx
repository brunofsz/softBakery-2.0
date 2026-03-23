import { useEffect, useState } from 'react'
import ProdutoFormModal from '../components/ProdutoFormModal'
import useToast from '../hooks/useToast'
import { listarFornecedores } from '../services/fornecedoresService'
import {
  atualizarProduto,
  criarProduto,
  excluirProduto,
  listarProdutos,
} from '../services/produtosService'
import './Produtos.css'

const Produtos = () => {
  const [produtos, setProdutos] = useState([])
  const [fornecedores, setFornecedores] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [produtoEmEdicao, setProdutoEmEdicao] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [modalErrorMessage, setModalErrorMessage] = useState('')

  useEffect(() => {
    carregarProdutos()
  }, [])

  const carregarProdutos = async () => {
    try {
      setLoading(true)
      setErrorMessage('')

      const [produtosData, fornecedoresData] = await Promise.all([
        listarProdutos(),
        listarFornecedores(),
      ])

      setProdutos(produtosData)
      setFornecedores(fornecedoresData)
    } catch (error) {
      console.error(error)
      setErrorMessage(error.message || 'Não foi possível carregar os produtos.')
    } finally {
      setLoading(false)
    }
  }

  const abrirModalCriacao = () => {
    setModalMode('create')
    setProdutoEmEdicao(null)
    setModalErrorMessage('')
    setIsModalOpen(true)
  }

  const abrirModalEdicao = (produto) => {
    setModalMode('edit')
    setProdutoEmEdicao(produto)
    setModalErrorMessage('')
    setIsModalOpen(true)
  }

  const fecharModal = () => {
    if (isSubmitting) {
      return
    }

    setIsModalOpen(false)
    setProdutoEmEdicao(null)
    setModalErrorMessage('')
  }

  const handleSubmitProduto = async (produtoData) => {
    try {
      setIsSubmitting(true)
      setModalErrorMessage('')

      if (modalMode === 'edit' && produtoEmEdicao) {
        await atualizarProduto(produtoEmEdicao.id, produtoData)
        useToast('Produto atualizado com sucesso.')
      } else {
        await criarProduto(produtoData)
        useToast('Produto criado com sucesso.')
      }

      await carregarProdutos()
      fecharModal()
    } catch (error) {
      console.error(error)
      setModalErrorMessage(error.message || 'Não foi possível salvar o produto.')
      useToast(error.message || 'Não foi possível salvar o produto.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleExcluirProduto = async (id) => {
    try {
      await excluirProduto(id)
      await carregarProdutos()
      useToast('Produto excluído com sucesso.')
    } catch (error) {
      console.error(error)
      useToast(error.message || 'Não foi possível excluir o produto.', 'error')
    }
  }

  return (
    <div className="page">
      <div className="pageHeader pageHeaderInline">
        <div>
          <h1>Produtos</h1>
          <p>Gerencie os produtos da padaria</p>
        </div>

        <button className="primaryBtn" onClick={abrirModalCriacao}>
          Novo produto
        </button>
      </div>

      <div className="sectionCard">
        {loading && <p>Carregando produtos...</p>}

        {!loading && errorMessage && <p>{errorMessage}</p>}

        {!loading && !errorMessage && produtos.length === 0 && (
          <p>Nenhum produto encontrado.</p>
        )}

        {!loading && !errorMessage && produtos.length > 0 && (
          <div className="tableWrapper">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Preço</th>
                  <th>Estoque</th>
                  <th>Estoque mínimo</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {produtos.map((produto) => (
                  <tr key={produto.id}>
                    <td>{produto.nome}</td>
                    <td>
                      {Number(produto.preco).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </td>
                    <td>{produto.estoque}</td>
                    <td>{produto.estoqueMinimo}</td>
                    <td>
                      <span
                        className={
                          produto.estoque <= produto.estoqueMinimo
                            ? 'badge danger'
                            : 'badge success'
                        }
                      >
                        {produto.estoque <= produto.estoqueMinimo
                          ? 'Estoque baixo'
                          : 'Normal'}
                      </span>
                    </td>
                    <td>
                      <div className="tableActions">
                        <button
                          className="tableBtn edit"
                          onClick={() => abrirModalEdicao(produto)}
                        >
                          Editar
                        </button>
                        <button
                          className="tableBtn delete"
                          onClick={() => handleExcluirProduto(produto.id)}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ProdutoFormModal
        isOpen={isModalOpen}
        mode={modalMode}
        initialValues={produtoEmEdicao}
        fornecedores={fornecedores}
        isSubmitting={isSubmitting}
        errorMessage={modalErrorMessage}
        onClose={fecharModal}
        onSubmit={handleSubmitProduto}
      />
    </div>
  )
}

export default Produtos
