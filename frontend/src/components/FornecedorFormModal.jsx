import { useEffect, useState } from 'react'
import './ProdutoFormModal.css'

const initialFormState = {
  nome: '',
  email: '',
  telefone: '',
  endereco: '',
}

const FornecedorFormModal = ({
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
      email: initialValues?.email ?? '',
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
      email: formData.email.trim(),
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
        aria-labelledby="fornecedor-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modalHeader">
          <div>
            <h2 id="fornecedor-modal-title">
              {mode === 'edit' ? 'Editar fornecedor' : 'Novo fornecedor'}
            </h2>
            <p>Preencha os dados para salvar o fornecedor.</p>
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
              placeholder="Ex.: Moinho União"
              required
            />
          </label>

          <label className="modalField">
            <span>E-mail</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="modalInput"
              placeholder="contato@fornecedor.com"
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
              placeholder="Cidade ou endereço completo"
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
                  : 'Criar fornecedor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FornecedorFormModal
