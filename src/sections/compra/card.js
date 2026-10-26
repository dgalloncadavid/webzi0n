/* Tarjeta de crédito: marca, dígito verificador (Luhn) y máscaras de escritura.
   Solo validación local del prototipo: nada se envía. */
export function cardBrand(d) {
  if (/^3[47]/.test(d)) return 'amex'
  if (/^4/.test(d)) return 'visa'
  if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/.test(d)) return 'mastercard'
  return ''
}

export function luhn(d) {
  let s = 0
  let alt = false
  for (let i = d.length - 1; i >= 0; i--) {
    let n = +d[i]
    if (alt) { n *= 2; if (n > 9) n -= 9 }
    s += n
    alt = !alt
  }
  return d.length >= 13 && s % 10 === 0
}

/* 4-4-4-4, o 4-6-5 en American Express */
export function maskCard(d) {
  return cardBrand(d) === 'amex'
    ? d.replace(/^(\d{0,4})(\d{0,6})(\d{0,5}).*/, (m, a, c, e) => [a, c, e].filter(Boolean).join(' '))
    : d.replace(/(\d{4})(?=\d)/g, '$1 ')
}

/* MM/AA; un primer dígito mayor que 1 se completa con 0 (5 → 05) */
export function maskExpiry(v) {
  let d = v.replace(/\D/g, '').slice(0, 4)
  if (d.length === 1 && +d > 1) d = '0' + d
  return d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d
}

export function validExpiry(v) {
  const ex = v.split('/')
  const mm = +ex[0]
  const yy = 2000 + (+ex[1] || 0)
  return mm >= 1 && mm <= 12 && !!ex[1] && ex[1].length === 2 && new Date(yy, mm) > new Date()
}
