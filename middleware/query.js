export default ({ app }) => {
  app.router.afterEach((to, from) => {
    if (!hasQueryParams(to) && hasQueryParams(from)) {
      return app.router.push({
        path: to.path,
        query: from.query
      })
    } else {
    }
  })
}

function hasQueryParams(route) {
  return !!Object.keys(route.query).length
}