const URLS = {
  twoFactor: '/auth/two-factor/',
  register: '/auth/users/',
  me: '/auth/users/me/',
  activate: '/auth/users/activation/',
  reactivate: '/auth/users/resend_activation/',
  setPassword: '/auth/users/set_password/',
  resetPassword: '/auth/users/reset_password/',
  resetPasswordConfirm: '/auth/users/reset_password_confirm/',
  trade: '/trade',
  profile: '/profile',
  mailing: '/mailing/list',
  analytics: '/analytics',
  upload: '/upload',
  verify: '/identity/verify',
  otp: '/otp',
  setSecret: '/profile/secret',
  dashboard: '/dashboard',
  tradeList: '/trade/',
  rates: '/rates/v2',
  paymentInfo: '/payment/info',
  invoice: '/invoice',
  getAddress: '/get_address/',
  getDepositAccount: '/get_deposit_account/',
  markPaid: '/mark_paid',
  email: '/email',
  inviteFriends: '/invite_friends/',
  referrals: '/referrals/',
  withdrawReward: 'withdraw-reward/',
}

// Access any enpoints by using this.$api.[endpoint name](data)
export default ({ $axios }, inject) => {
  inject('api', {
    /* ------------------------------ AUTH ------------------------------ */

    // Login user { access, refresh }

    // New user signup { firstName, lastName, mobile, email, password, marketing_email_subscription }
    register: (data) => $axios.post(URLS.register, data),

    // Activate user using link sent to user's email { uid, token }
    activate: (data) => $axios.post(URLS.activate, data),

    // Resend Activation { email }
    reactivate: (data) => $axios.post(URLS.reactivate, data),

    // Set password { newPassword, currentPassword }
    setPassword: (data) => $axios.post(URLS.setPassword, data),

    // Reset password { email }
    resetPassword: (data) => $axios.post(URLS.resetPassword, data),

    updateUser: (data) => $axios.patch(URLS.me, data),

    // Reset password { uid, token, newPassword, reNewPassword }
    resetPasswordConfirm: (data) =>
      $axios.post(URLS.resetPasswordConfirm, data),

    // Verify user login with 2-factor { code: 'SEC-OTP', pinID: '' } ()
    // Response: { status: 'success/error', details: {}, secret }
    twoFactor: (data) => $axios.post(URLS.twoFactor, data),

    getTwoFactor: () => $axios.get(`${URLS.twoFactor}`),

    // Add a new mobile number { type: 'Generic/Update', newMobile: '', currentMobile: '' }
    // Response: { status: 'success/error', details: { pinId, to, smsStatus, status } }
    sendOTP: (data) => $axios.post(`${URLS.otp}/send`, data),

    // Verify a new mobile number { code: '', pinId: '' }
    // Response: { status, details: { pinId, verified, msisdn, attemptsRemaining } }
    verifyOTP: (data) => $axios.post(`${URLS.otp}/verify`, data),

    // Set secret key { code: '', type: 'First/Update' }
    setSecretKey: (data) => $axios.post(URLS.setSecret, data),

    emailCheck: (data) => $axios.post(`${URLS.email}/check`, data),

    /* ------------------------------ AUTH ------------------------------ */

    /* ------------------------------ PROFILE/TRADES ------------------------------ */

    // Update fields in user profile { fieldName: value }
    updateProfile: (data) => $axios.patch(URLS.profile, data),

    // Set or change user's security key { type, security_key, new_security_key }
    changeSecret: (data) => $axios.post(`${URLS.profile}/secret`, data),

    // Subscribe/Unsubscribe from mailing list { id }
    updateMailing: (action) => $axios.post(`${URLS.mailing}?action=${action}`),

    // Subscribe/Unsubscribe from mailing list { id }
    inviteFriends: (data) => $axios.post(URLS.inviteFriends, data),

    // Get referrals
    getReferrals: () => $axios.get(URLS.referrals),

    // withdraw reward { wallet_address }
    withdrawReward: (data) => $axios.post(URLS.withdrawReward, data),

    // Fetch trade information { id }
    fetchTrade: (id) => $axios.get(`${URLS.trade}/${id}`),

    postTrade: (data) => $axios.post(`${URLS.trade}/`, data),
    // Fetch dashboard information
    getDashboard: () => $axios.get(URLS.dashboard),

    getRecipients: (payload) => $axios.get(URLS.paymentInfo, {params: payload}),

    getRates: () => $axios.get(URLS.rates),

    getInvoice: (id) => $axios.get(`${URLS.invoice}/${id}`),

    getAddress: (payload) => $axios.get(URLS.getAddress, {params: payload}),

    getDepositAccount: (payload) => $axios.get(URLS.getDepositAccount, {params: payload}),

    markPaid: (data) => $axios.post(URLS.markPaid, data),

    // Fetch user trades
    fetchTrades: (page, status) =>
      $axios.get(`${URLS.tradeList}?page=${page}&status=${status}`),
    // ?page=${page}&status=${status}
    /* ------------------------------ PROFILE/TRADES ------------------------------ */

    /* ------------------------------ FILES ------------------------------ */

    // Handle file upload
    uploadFile: (data) =>
      $axios.post(URLS.upload, data, {
        headers: {
          'content-type': 'multipart/form-data'
        }
      }),

    /* ------------------------------ FILES ------------------------------ */

    /* ------------------------------ IDENTITY ------------------------------ */

    // Handle identify veification (return text to be written with ID)
    // Response: { status, code, message }
    getProfileCode: () => $axios.get(URLS.verify),

    // Handle identify verification { url, code }
    // Response: { status, message }
    verifyIdentity: (data) => $axios.post(URLS.verify, data)

    /* ------------------------------ IDENTITY ------------------------------ */
  })
}
