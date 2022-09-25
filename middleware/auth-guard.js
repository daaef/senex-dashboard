export default function({ $auth, store, route, redirect, app }) {
  const guestRoute = ['/signin', '/forgot-password', '/create-account', '/order', '/order/start']
  const guestRoute2 = ['/signin', '/forgot-password', '/create-account']
  // console.log('includes guest routes', guestRoute.includes(route.path))
  // console.log('route is',route)
  if (!store.state.auth.loggedIn && !guestRoute.includes(route.path)) {
    const REDIRECT_URL = '/signin?redirect=' + route.path
    if (!$auth.loggedIn) {
      redirect(REDIRECT_URL)
    }
  }

  if ($auth.loggedIn && guestRoute2.includes(route.path) && route.path.indexOf('invoice') !== '-1'){
    redirect('/')
  }

  if (
    $auth.loggedIn &&
    !$auth.user.profile.mobileVerified
  ) {
    return redirect('/verify')
  }
  if (
    $auth.loggedIn &&
    !$auth.user.profile.securityKeyChanged
  ) {
    return redirect('/secret')
  }
}
