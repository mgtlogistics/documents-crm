// Concatena los campos de un domicilio en una sola línea legible para contratos y cartas.
export default function formatFullAddress(address = {}, fallback = 'No llenado') {
  const {
    street,
    exteriorNumber,
    interiorNumber,
    neighborhood,
    locality,
    city,
    state,
    postalCode,
    country,
  } = address || {}

  const parts = [
    [street, exteriorNumber].filter(Boolean).join(' ') || null,
    interiorNumber ? `número interior ${interiorNumber}` : null,
    neighborhood ? `colonia ${neighborhood}` : null,
    locality,
    city,
    state,
    postalCode ? `Código Postal ${postalCode}` : null,
    country,
  ].filter((part) => typeof part === 'string' && part.trim().length > 0)

  return parts.length > 0 ? parts.join(', ') : fallback
}
