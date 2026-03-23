import { useEffect, useState } from 'react'
import './ProdutoFormModal.css'

const initialFormState = {
  nome: '',
  descricao: '',
  preco: '',
  estoque: '',
  estoqueMinimo: '',
  fornecedorId: '',
}

const ProdutoFormModal = ({
  isOpen,
  mode = 'create',
  initialValues = initialFormState,
  fornecedores = [],
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
      descricao: initialValues?.descricao ?? '',
      preco: initialValues?.preco ?? '',
      estoque: initialValues?.estoque ?? '',
      estoqueMinimo: initialValues?.estoqueMinimo ?? '',
      fornecedorId: initialValues?.fornecedorId ?? '',
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
      descricao: formData.descricao.trim(),
      preco: Number(formData.preco),
      estoque: Number(formData.estoque),
      estoqueMinimo: Number(formData.estoqueMinimo),
      fornecedorId: Number(formData.fornecedorId),
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
          <div className="modalFormGrid modalFormGridTop">
            <label className="modalField">
              <span>Nome</span>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className="modalInput"
                placeholder="Ex.: Pão francês"
                required
              />
            </label>

            <label className="modalField">
              <span>Descrição</span>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                className="modalInput modalTextarea"
                placeholder="Ex.: Fatiado e fracionado para venda no balcão"
                rows="2"
              />
            </label>
          </div>

          <div className="modalFormGrid modalFormGridWide">
            <label className="modalField">
              <span>Preço</span>
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
              <span>Fornecedor</span>
              <select
                name="fornecedorId"
                value={formData.fornecedorId}
                onChange={handleChange}
                className="modalInput"
                required
              >
                <option value="">Selecione um fornecedor</option>
                {fornecedores.map((fornecedor) => (
                  <option key={fornecedor.id} value={fornecedor.id}>
                    {fornecedor.nome}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="modalFormGrid modalFormGridCompact">
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

            <label className="modalField">
              <span>Estoque mínimo</span>
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
              {isSubmitting
                ? 'Salvando...'
                : mode === 'edit'
                  ? 'Salvar alterações'
                  : 'Criar produto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProdutoFormModal
