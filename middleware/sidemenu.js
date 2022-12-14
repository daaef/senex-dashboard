export default ({ app, store }) => {
  app.router.afterEach((to, from) => {
    store.commit('setRoutePath', to.path)
  })
}