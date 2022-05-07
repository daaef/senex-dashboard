export const state = () => ({
  orderID: '',
  info: null,
  paid: false,
  step: 'load',
  guideImage: 'yellow-image', // payment1, green-image, yellow-image, blue-image
  timeLeft: -1,
  instructionChecked: false
})

export const mutations = {
  setOrderID(state, payload) {
    state.orderID = payload
  },
  setInfo(state, payload) {
    state.info = payload
  },
  setPaid(state, payload) {
    state.paid = payload
  },
  setStep(state, payload) {
    state.step = payload
  },
  setGuideImage(state, payload) {
    state.guideImage = payload
  },
  setTimeLeft(state, payload) {
    state.timeLeft = payload
  },
  setInstructionChecked(state, payload) {
    state.instructionChecked = payload
  }
}

export const actions = {
  setTimeLeft({ commit }, timeLeft) {
    commit('setTimeLeft', timeLeft)
  },
  setInstructionChecked({ commit }, checked) {
    commit('setInstructionChecked', checked)
  }
}