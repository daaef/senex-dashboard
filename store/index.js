// Create global store here
export const state = () => ({
  routePath: '',
})

export const mutations = {
  setRoutePath(state, payload) {
    state.routePath = payload
  },
}