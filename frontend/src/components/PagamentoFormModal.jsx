import { useEffect, useState } from 'react'
import './ProdutoFormModal.css'

const initialFormState = {
  clienteId: '',
  valor: '',
  formaPagamento: 'AVISTA',
}

const PagamentoFormModal = ({
  isOpen,
  clientes = [],
  initialClienteId = '',
  isSubmitting = false,
  errorMessage = '',
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState(initialFormState)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    setFormData({
      clienteId: initialClienteId ? String(initialClienteId) : '',
      valor: '',
      formaPagamento: 'AVISTA',
    })
  }, [initialClienteId, isOpen])

  if (!isOpen) {
    return null
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    onSubmit?.({
      clienteId: Number(formData.clienteId),
      valor: Number(formData.valor),
      formaPagamento: formData.formaPagamento,
    })
  }

  return (
    <div className="modalOverlay" role="presentation" onClick={onClose}>
      <div
        className="modalCard"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pagamento-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modalHeader">
          <div>
            <h2 id="pagamento-modal-title">Registrar pagamento</h2>
            <p>Informe o cliente, o valor e a forma de pagamento.</p>
          </div>

          <button
            type="button"
            className="modalCloseBtn"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Fechar
          </button>
        </div>

        <form className="modalForm" onSubmit={handleSubmit}>
          <label className="modalField">
            <span>Cliente</span>
            <select
              name="clienteId"
              value={formData.clienteId}
              onChange={handleChange}
              className="modalInput"
              required
            >
              <option value="">Selecione um cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nome}
                </option>
              ))}
            </select>
          </label>

          <div className="modalFormGrid">
            <label className="modalField">
              <span>Valor</span>
              <input
                type="number"
                name="valor"
                value={formData.valor}
                onChange={handleChange}
                className="modalInput"
                min="0.01"
                step="0.01"
                placeholder="0,00"
                required
              />
            </label>

            <label className="modalField">
              <span>Forma de pagamento</span>
              <select
                name="formaPagamento"
                value={formData.formaPagamento}
                onChange={handleChange}
                className="modalInput"
                required
              >
                <option value="AVISTA">A vista</option>
                <option value="CREDITO">Credito</option>
                <option value="FIADO">Fiado</option>
              </select>
            </label>
          </div>

          {errorMessage && <p className="modalError">{errorMessage}</p>}

          <div className="modalActions">
            <button
              type="button"
              className="tableBtn"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>

            <button type="submit" className="primaryBtn" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Registrar pagamento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PagamentoFormModal
