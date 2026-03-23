import { useEffect, useState } from 'react'
import './ProdutoFormModal.css'

const initialFormState = {
  nome: '',
  preco: '',
  estoque: '',
  estoqueMinimo: '',
}

const ProdutoFormModal = ({
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
      preco: initialValues?.preco ?? '',
      estoque: initialValues?.estoque ?? '',
      estoqueMinimo: initialValues?.estoqueMinimo ?? '',
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
      preco: Number(formData.preco),
      estoque: Number(formData.estoque),
      estoqueMinimo: Number(formData.estoqueMinimo),
    })
  }

  return (
    <div className="modalOverlay" role="presentation" onClick={onClose}>
      <div
        className="modalCard"
        role="dialog"
        aria-modal="true"
        aria-labelledby="produto-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modalHeader">
          <div>
            <h2 id="produto-modal-title">
              {mode === 'edit' ? 'Editar produto' : 'Novo produto'}
            </h2>
            <p>Preencha os dados para salvar o produto.</p>
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
              placeholder="Ex.: Pao frances"
              required
            />
          </label>

          <div className="modalFormGrid">
            <label className="modalField">
              <span>Preco</span>
              <input
                type="number"
                name="preco"
                value={formData.preco}
                onChange={handleChange}
                className="modalInput"
                min="0"
                step="0.01"
                placeholder="0,00"
                required
              />
            </label>

            <label className="modalField">
              <span>Estoque</span>
              <input
                type="number"
                name="estoque"
                value={formData.estoque}
                onChange={handleChange}
                className="modalInput"
                min="0"
                step="1"
                placeholder="0"
                required
              />
            </label>
          </div>

          <label className="modalField">
            <span>Estoque minimo</span>
            <input
              type="number"
              name="estoqueMinimo"
              value={formData.estoqueMinimo}
              onChange={handleChange}
              className="modalInput"
              min="0"
              step="1"
              placeholder="0"
              required
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
                  ? 'Salvar alteracoes'
                  : 'Criar produto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProdutoFormModal
