import { useEffect, useState } from 'react'
import FornecedorFormModal from '../components/FornecedorFormModal.jsx'
import {
  atualizarFornecedor,
  criarFornecedor,
  excluirFornecedor,
  listarFornecedores,
} from '../services/fornecedoresService'
import formatTelefone from '../utils/formatTelefone.js'
import useToast from '../hooks/useToast.js'
import './Fornecedores.css'

const Fornecedores = () => {
  const [fornecedores, setFornecedores] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [fornecedorEmEdicao, setFornecedorEmEdicao] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [modalErrorMessage, setModalErrorMessage] = useState('')

  useEffect(() => {
    carregarFornecedores()
  }, [])

  const carregarFornecedores = async () => {
    try {
      setLoading(true)
      setErrorMessage('')

      const data = await listarFornecedores()
      setFornecedores(data)
    } catch (error) {
      console.error(error)
      setErrorMessage(error.message || 'Nao foi possivel carregar os fornecedores.')
    } finally {
      setLoading(false)
    }
  }

  const abrirModalCriacao = () => {
    setModalMode('create')
    setFornecedorEmEdicao(null)
    setModalErrorMessage('')
    setIsModalOpen(true)
  }

  const abrirModalEdicao = (fornecedor) => {
    setModalMode('edit')
    setFornecedorEmEdicao(fornecedor)
    setModalErrorMessage('')
    setIsModalOpen(true)
  }

  const fecharModal = () => {
    if (isSubmitting) {
      return
    }

    setIsModalOpen(false)
    setFornecedorEmEdicao(null)
    setModalErrorMessage('')
  }

  const handleSubmitFornecedor = async (fornecedorData) => {
    try {
      setIsSubmitting(true)
      setModalErrorMessage('')

      if (modalMode === 'edit' && fornecedorEmEdicao) {
        await atualizarFornecedor(fornecedorEmEdicao.id, fornecedorData)
        useToast('Fornecedor atualizado com sucesso.')
      } else {
        await criarFornecedor(fornecedorData)
        useToast('Fornecedor criado com sucesso.')
      }

      await carregarFornecedores()
      fecharModal()
    } catch (error) {
      console.error(error)
      const message = error.message || 'Nao foi possivel salvar o fornecedor.'
      setModalErrorMessage(message)
      useToast(message, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleExcluirFornecedor = async (id) => {
    try {
      await excluirFornecedor(id)
      await carregarFornecedores()
      useToast('Fornecedor excluido com sucesso.')
    } catch (error) {
      console.error(error)
      const message = error.message || 'Nao foi possivel excluir o fornecedor.'
      useToast(message, 'error')
    }
  }

  return (
    <div className="page">
      <div className="pageHeader pageHeaderInline">
        <div>
          <h1>Fornecedores</h1>
          <p>Fornecedores cadastrados no sistema</p>
        </div>

        <button className="primaryBtn" onClick={abrirModalCriacao}>
          Novo fornecedor
        </button>
      </div>

      <div className="sectionCard">
        {loading && <p>Carregando fornecedores...</p>}
        {!loading && errorMessage && <p>{errorMessage}</p>}

        {!loading && !errorMessage && fornecedores.length === 0 && (
          <p>Nenhum fornecedor encontrado.</p>
        )}

        {!loading && !errorMessage && fornecedores.length > 0 && (
          <div className="tableWrapper">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Telefone</th>
                  <th>Cidade</th>
                  <th>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {fornecedores.map((fornecedor) => (
                  <tr key={fornecedor.id}>
                    <td>{fornecedor.nome}</td>
                    <td>{fornecedor.email}</td>
                    <td>{formatTelefone(fornecedor.telefone)}</td>
                    <td>{fornecedor.endereco}</td>
                    <td>
                      <div className="tableActions">
                        <button
                          className="tableBtn edit"
                          onClick={() => abrirModalEdicao(fornecedor)}
                        >
                          Editar
                        </button>
                        <button
                          className="tableBtn delete"
                          onClick={() => handleExcluirFornecedor(fornecedor.id)}
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

      <FornecedorFormModal
        isOpen={isModalOpen}
        mode={modalMode}
        initialValues={fornecedorEmEdicao}
        isSubmitting={isSubmitting}
        errorMessage={modalErrorMessage}
        onClose={fecharModal}
        onSubmit={handleSubmitFornecedor}
      />
    </div>
  )
}

export default Fornecedores
