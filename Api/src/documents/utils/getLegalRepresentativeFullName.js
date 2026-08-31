// Compone el nombre completo del representante legal a partir de la empresa del usuario.
export default function getLegalRepresentativeFullName(company = {}) {
  const representative = company?.legalRepresentative || {}
  const fullName = [
    representative.firstName,
    representative.paternalLastName,
    representative.maternalLastName,
  ]
    .filter((part) => typeof part === 'string' && part.trim().length > 0)
    .join(' ')
    .trim()

  return fullName || company?.legalRepresentativeName || 'No llenado'
}
