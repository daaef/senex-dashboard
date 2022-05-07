import { countries } from 'countries-list'

const flagByCountryCode = (countryCode) => {
  return `https://flagcdn.com/${countryCode.toLowerCase()}.svg`
};

const flagByCurrency = (currency) => {
  for (const country in countries) {
    const currencyList = countries[country].currency.split(',')
    if (currencyList[0] == currency) {
      return flagByCountryCode(country.toLowerCase())
    }
  }
};

export {flagByCountryCode, flagByCurrency}