export const state = () => ({
  loadingDetails: {
    show: false,
    text: ''
  },
  isCheckoutCardOpen: true,
  signedIn: 0, // 0 - not signed in, 1 - allowed to pass through, 2 - signed in
  showReview: false,
  userInfo: {
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    password: ''
  },
  beneficiaries: [],
  orderDetail: {
    cryptoAmount: 0,
    cryptoCurrency: '',
    fiatAmount: 0,
    fiatCurrency: '',
    fiatSymbol: '',
    orderType: '',
    usdToFiat: { buy: 0, sell: 0 },
    expires: 0,
    cryptoFiatRate: 0,
    platformFee: 0,
    platformFeeCap: 0
  },
  placeOrder: {

  },
  hasTriedPlacingOrder: false,
  openListPopUp: false,
  selectedWallet: {
    id: '',
    currency: '',
    label: '',
    walletAddress: ''
  },
  selectedBankAccount: {
    id: '',
    currency: '',
    accountNumber: '',
    accountName: '',
    bank: '',
    bankName: ''
  },
  selectedBank: {
    label: '',
    value: ''
  },
  timer: null,
  totalTime: -1,
  currentOrderStep: 1,
  coinsInfo: [
    {
      name: 'Bitcoin',
      cur: 'BTC',
      flag: '/img/crypto/btc.svg'
    },
    {
      name: 'USDT',
      cur: 'USDT',
      flag: '/img/crypto/usdt.svg'
    }
  ]
})

export const mutations = {
  changeLoading(state, payload) {
    state.loadingDetails = payload
  },
  setSignedIn(state, payload) {
    state.signedIn = payload
  },
  setIsCheckoutCardOpen(state, payload) {
    state.isCheckoutCardOpen = payload
  },
  setShowReview(state, payload) {
    state.showReview = payload
  },
  setUserInfo(state, payload) {
    state.userInfo = payload
  },
  setBeneficiaries(state, payload) {
    state.beneficiaries = payload
  },
  setPlaceOrder(state, payload) {
    state.placeOrder = payload
  },
  setHasTriedPlacingOrder(state, payload) {
    state.hasTriedPlacingOrder = payload
  },
  addBeneficiary(state, payload) {
    state.beneficiaries.push(payload)
  },
  setOrderDetail(state, payload) {
    state.orderDetail = payload
  },
  setOpenList(state, payload) {
    state.openListPopUp = payload
  },
  selectWallet(state, payload) {
    state.selectedWallet = payload
  },
  selectBankAccount(state, payload) {
    state.selectedBankAccount = payload
  },
  selectBank(state, payload) {
    state.selectedBank = payload
  },
  setTimer(state, payload) {
    state.timer = payload
  },
  decreaseTimer(state) {
    state.totalTime--
  },
  setTotalTime(state, payload) {
    state.totalTime = payload
  },
  changeCurrentOrderStep(state, payload) {
    state.currentOrderStep = payload
  }
}

export const actions = {
  changeLoading({ commit }, payload) {
    commit('changeLoading', payload)
  },
  setIsCheckoutCardOpen({ commit }, payload) {
    commit('setIsCheckoutCardOpen', payload)
  },
  setBeneficiaries({ commit }, payload) {
    commit('setBeneficiaries', payload)
  },
  addBeneficiary({state, commit }, payload) {
    if (state.orderDetail.orderType === 'buy') {
      const idx = state.beneficiaries.findIndex(b => b.walletAddress === payload.walletAddress)
      if (idx !== -1) {
        const newBeneficiaries = [...state.beneficiaries.slice(0, idx), payload, ...state.beneficiaries.slice(idx + 1)]
        commit('setBeneficiaries', newBeneficiaries)
      } else {
        commit('addBeneficiary', payload)
      }
    } else {
      const idx = state.beneficiaries.findIndex(b => b.accountNumber === payload.accountNumber && b.bank === payload.bank)
      if (idx !== -1) {
        const newBeneficiaries = [...state.beneficiaries.slice(0, idx), payload, ...state.beneficiaries.slice(idx + 1)]
        commit('setBeneficiaries', newBeneficiaries)
      } else {
        commit('addBeneficiary', payload)
      }
    }
  },
  setOrderDetail({ commit }, payload) {
    commit('setOrderDetail', payload)
  },
  setPlaceOrder({ commit }, payload) {
    commit('setPlaceOrder', payload)
  },
  setHasTriedPlacingOrder({ commit }, payload) {
    commit('setHasTriedPlacingOrder', payload)
  },
  setOpenList({ commit }, payload) {
    commit('setOpenList', payload)
  },
  selectWallet({ commit }, payload) {
    commit('selectWallet', payload)
  },
  selectBankAccount({ commit }, payload) {
    commit('selectBankAccount', payload)
  },
  selectBank({ commit }, payload) {
    commit('selectBank', payload)
  },
  countdown({state, commit}) {
    if (state.totalTime >= 1) {
      commit('decreaseTimer')
    } else {
      commit('setTotalTime', 0)
    }
  },
  resetTimer({ state, commit }, timeLeft) {
    commit('setTotalTime', timeLeft)
    clearInterval(state.timer)
    commit('setTimer', null)
  },
  startTimer({ dispatch, commit }, timeLeft) {
    dispatch('resetTimer', timeLeft)
    return new Promise((res, rej) => {
      let id = setInterval(() => {
        dispatch('countdown')
        res()
      }, 1000)
      commit('setTimer', id)
      this.$cookiz.set('timerClearId', id)
    })
    // setInterval(() => {
    //   dispatch('countdown')
    // }, 1000)
  },
  setTotalTime({ commit }, timeLeft) {
    commit('setTotalTime', timeLeft)
  }

}