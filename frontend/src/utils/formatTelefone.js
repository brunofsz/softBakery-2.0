const formatTelefone = (value) => {
  if (!value) {
    return ''
  }

  const digits = String(value).replace(/\D/g, '')
  const normalizedDigits = digits.startsWith('55') ? digits.slice(2) : digits

  if (normalizedDigits.length === 11) {
    return normalizedDigits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }

  if (normalizedDigits.length === 10) {
    return normalizedDigits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }

  return value
}

export default formatTelefone;
