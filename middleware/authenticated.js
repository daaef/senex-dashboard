export default ({ app, store, route, redirect }) => {
  // const guestRoute = ['/signin', '/create-account', '/forgot-password']
  const guestRoute = ['/signin', '/forgot-password', '/create-account', '/order', '/order/start']
  // run only on server
  if (process.server) {
    // redirect to dashboard if user is already logged in
    if (store.state.auth.loggedIn && guestRoute.includes(route.path)) {
      return redirect('/')
    }
    if (
      store.state.auth.loggedIn &&
      !store.state.auth.user.profile.mobileVerified
    ) {
      return redirect('/verify')
    }
    if (
      store.state.auth.loggedIn &&
      !store.state.auth.user.profile.securityKeyChanged
    ) {
      return redirect('/secret')
    }
    // if (store.state.auth.loggedIn && route.path === '/register') {
    //   return redirect('/dashboard')
    // }
  }
  // run only on browser
  if (!process.server) {
    console.log('client route is', route.path)
    if (guestRoute.includes(route.path)) {
      if (store.state.auth.loggedIn) {
        return redirect('/')
      }
      return
    }
    // detect if user is logged in
    if (!store.state.auth.loggedIn) {
      app.$auth.logout()
      return redirect('/signin')
    }
    // check if user has verified profile
    if (!store.state.auth.user.profile.mobileVerified) {
      return redirect('/verify')
    }
    // set security key
    if (!store.state.auth.user.profile.securityKeyChanged) {
      return redirect('/secret')
    }
  }
}
