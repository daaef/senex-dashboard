export default function({ $auth, store, route, redirect, app }) {
  // const guestRoute = ['/signin', '/forgot-password', '/create-account', '/order', '/order/start']
  const guestRoute = ['/signin', '/forgot-password', '/create-account', '/activate', '/re-activation']
  // console.log('includes guest routes', guestRoute.includes(route.path))
  // console.log('route is',route)
  if (!store.state.auth.loggedIn 
    && !guestRoute.includes(route.path)  
    && route.fullPath.indexOf('order') == '-1'
    && route.fullPath.indexOf('invoice') == '-1'
    && route.fullPath.indexOf('activate') == '-1'
    && route.fullPath.indexOf('forgot-password') == '-1') {
    const REDIRECT_URL = '/signin?redirect=' + route.path
    if (!$auth.loggedIn) {
      redirect(REDIRECT_URL)
    }
  }

  if ($auth.loggedIn && guestRoute.includes(route.path) 
  && route.fullPath.indexOf('activate') !== '-1'
  && route.fullPath.indexOf('forgot-password') !== '-1'){
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
