import { useEffect, useState } from 'react'
import ClienteFormModal from '../components/ClienteFormModal.jsx'
import PagamentoFormModal from '../components/PagamentoFormModal.jsx'
import './Clientes.css'
import {
  atualizarCliente,
  criarCliente,
  excluirCliente,
  listarClientes,
} from "../services/clientesService.js"
import { criarPagamento } from '../services/pagamentosService.js'
import formatMoney from '../utils/formatMoney.js'
import formatTelefone from '../utils/formatTelefone.js'
import useToast from '../hooks/useToast.js'

const Clientes = () => {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [clienteEmEdicao, setClienteEmEdicao] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [modalErrorMessage, setModalErrorMessage] = useState('')
  const [isPagamentoModalOpen, setIsPagamentoModalOpen] = useState(false)
  const [pagamentoClienteId, setPagamentoClienteId] = useState('')
  const [pagamentoErrorMessage, setPagamentoErrorMessage] = useState('')

  useEffect(() => {
    carregarClientes()
  }, [])

  const carregarClientes = async () => {
    try {
      setLoading(true)
      setErrorMessage('')

      const data = await listarClientes()
      setClientes(data)
    } catch (error) {
      console.error(error)
      setErrorMessage(error.message || 'Não foi possível carregar os clientes.')
    } finally {
      setLoading(false)
    }
  }

  const abrirModalCriacao = () => {
    setModalMode('create')
    setClienteEmEdicao(null)
    setModalErrorMessage('')
    setIsModalOpen(true)
  }

  const abrirModalEdicao = (cliente) => {
    setModalMode('edit')
    setClienteEmEdicao(cliente)
    setModalErrorMessage('')
    setIsModalOpen(true)
  }

  const fecharModal = () => {
    if (isSubmitting) {
      return
    }

    setIsModalOpen(false)
    setClienteEmEdicao(null)
    setModalErrorMessage('')
  }

  const handleSubmitCliente = async (clienteData) => {
    try {
      setIsSubmitting(true)
      setModalErrorMessage('')

      if (modalMode === 'edit' && clienteEmEdicao) {
        await atualizarCliente(clienteEmEdicao.id, clienteData)
        useToast('Cliente atualizado com sucesso.')
      } else {
        await criarCliente(clienteData)
        useToast('Cliente criado com sucesso.')
      }

      await carregarClientes()
      fecharModal()
    } catch (error) {
      console.error(error)
      const message = error.message || 'Não foi possível salvar o cliente.'
      setModalErrorMessage(message)
      useToast(message, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleExcluirCliente = async (id) => {
    try {
      await excluirCliente(id)
      await carregarClientes()
      useToast('Cliente excluído com sucesso.')
    } catch (error) {
      console.error(error)
      const message = error.message || 'Não foi possível excluir o cliente.'
      useToast(message, 'error')
    }
  }

  const abrirModalPagamento = (clienteId = '') => {
    setPagamentoClienteId(clienteId)
    setPagamentoErrorMessage('')
    setIsPagamentoModalOpen(true)
  }

  const fecharModalPagamento = () => {
    if (isSubmitting) {
      return
    }

    setIsPagamentoModalOpen(false)
    setPagamentoClienteId('')
    setPagamentoErrorMessage('')
  }

  const handleSubmitPagamento = async (pagamentoData) => {
    try {
      setIsSubmitting(true)
      setPagamentoErrorMessage('')

      await criarPagamento(pagamentoData)
      await carregarClientes()
      fecharModalPagamento()
      useToast('Pagamento registrado com sucesso.')
    } catch (error) {
      console.error(error)
      const message = error.message || 'Não foi possível registrar o pagamento.'
      setPagamentoErrorMessage(message)
      useToast(message, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="page">
      <div className="pageHeader pageHeaderInline">
        <div>
          <h1>Clientes</h1>
          <p>Controle de clientes e saldos devedores</p>
        </div>

        <div className="tableActions">
          <button className="primaryBtn" onClick={() => abrirModalPagamento()}>
            Registrar pagamento
          </button>
          <button className="primaryBtn" onClick={abrirModalCriacao}>
            Novo cliente
          </button>
        </div>
      </div>

      <div className="sectionCard">
        {loading && <p>Carregando clientes...</p>}

        {!loading && errorMessage && <p>{errorMessage}</p>}

        {!loading && !errorMessage && clientes.length === 0 && (
          <p>Nenhum cliente encontrado.</p>
        )}

        {!loading && !errorMessage && clientes.length > 0 && (
          <div className="tableWrapper">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Telefone</th>
                  <th>Endereço</th>
                  <th>Saldo devedor</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td>{cliente.nome}</td>
                    <td>{formatTelefone(cliente.telefone)}</td>
                    <td>{cliente.endereco}</td>
                    <td>{formatMoney(cliente.saldoDevedor)}</td>
                    <td>
                      <div className="tableActions">
                        <button
                          className="tableBtn edit"
                          onClick={() => abrirModalEdicao(cliente)}
                        >
                          Editar
                        </button>
                        <button
                          className="tableBtn"
                          onClick={() => abrirModalPagamento(cliente.id)}
                        >
                          Pagar
                        </button>
                        <button
                          className="tableBtn delete"
                          onClick={() => handleExcluirCliente(cliente.id)}
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

      <ClienteFormModal
        isOpen={isModalOpen}
        mode={modalMode}
        initialValues={clienteEmEdicao}
        isSubmitting={isSubmitting}
        errorMessage={modalErrorMessage}
        onClose={fecharModal}
        onSubmit={handleSubmitCliente}
      />

      <PagamentoFormModal
        isOpen={isPagamentoModalOpen}
        clientes={clientes.filter((cliente) => Number(cliente.saldoDevedor) > 0)}
        initialClienteId={pagamentoClienteId}
        isSubmitting={isSubmitting}
        errorMessage={pagamentoErrorMessage}
        onClose={fecharModalPagamento}
        onSubmit={handleSubmitPagamento}
      />
    </div>
  )
}

export default Clientes
