export default (value, currency) => {
  let formatter
  if (currency === 'NGN') {
    formatter = Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    })
  } else if (currency === 'USD') {
    formatter = Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })
  } else if (currency === 'ZAR') {
    formatter = Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    })
  } else {
    throw new Error('Unrecognized currency specification: ' + currency)
  }
  return formatter.format(value)
}
