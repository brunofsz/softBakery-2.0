import { useEffect, useState } from 'react'
import './ProdutoFormModal.css'

const initialFormState = {
  nome: '',
  telefone: '',
  endereco: '',
}

const ClienteFormModal = ({
  isOpen,
  mode = 'create',
  initialValues = initialFormState,
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
      nome: initialValues?.nome ?? '',
      telefone: initialValues?.telefone ?? '',
      endereco: initialValues?.endereco ?? '',
    })
  }, [initialValues, isOpen])

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
      nome: formData.nome.trim(),
      telefone: formData.telefone.trim(),
      endereco: formData.endereco.trim(),
    })
  }

  return (
    <div className="modalOverlay" role="presentation" onClick={onClose}>
      <div
        className="modalCard"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cliente-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modalHeader">
          <div>
            <h2 id="cliente-modal-title">
              {mode === 'edit' ? 'Editar cliente' : 'Novo cliente'}
            </h2>
            <p>Preencha os dados para salvar o cliente.</p>
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
            <span>Nome</span>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className="modalInput"
              placeholder="Ex.: Maria Eduarda"
              required
            />
          </label>

          <label className="modalField">
            <span>Telefone</span>
            <input
              type="text"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              className="modalInput"
              placeholder="11999998888"
            />
          </label>

          <label className="modalField">
            <span>Endereço</span>
            <input
              type="text"
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
              className="modalInput"
              placeholder="Rua, número e bairro"
            />
          </label>

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
              {isSubmitting
                ? 'Salvando...'
                : mode === 'edit'
                  ? 'Salvar alterações'
                  : 'Criar cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ClienteFormModal
