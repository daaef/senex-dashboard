// Create global store here
export const state = () => ({
  routePath: '',
  fiatCurrencies: [
    {
      name: 'Naira',
      ticker: 'NGN',
      flag: '/img/flag/ng.svg',
      locale: 'en-NG'
    },
    {
      name: 'Rand',
      ticker: 'ZAR',
      flag: '/img/flag/za.svg',
      locale: 'en-ZA'
    }
  ],
  cryptoCurrencies: [
    {
      name: '',
      ticker: '',
      flag: '',
    }
  ],
  selectedFiatCurrency: {
    name: 'Naira',
    ticker: 'NGN',
    flag: '',
    locale: 'en-NG'
  },
  selectedCryptoCurrency: {
    name: 'Bitcoin',
    ticker: 'BTC',
    flag: '',
  }
})

export const mutations = {
  setRoutePath(state, payload) {
    state.routePath = payload
  },
  setFiatCurrencies(state, payload) {
    state.fiatCurrencies = payload
  },
  setCryptoCurrencies(state, payload) {
    state.cryptoCurrencies = payload
  },
  setCurrencies(state, payload) {
    state.fiatCurrencies = payload.fiat
    state.cryptoCurrencies = payload.crypto
  },
  setSelectedFiatCurrency(state, payload) {
    state.selectedFiatCurrency = payload
  },
  setSelectedCryptoCurrency(state, payload) {
    state.selectedCryptoCurrency = payload
  }
}
