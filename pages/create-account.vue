<template>
  <div>
    <Register
      v-if="!isVerified"
      :verify-user="verifyUser"
      :save-email="saveEmail"
    />
    <VerifyEmail v-else :email="email" />
  </div>
</template>
<script>
export default {
  components: {
    // CardTitle
    // vSelect
  },
  layout: 'blank',
  // middleware: 'authenticated',
  data() {
    return {
      email: '',
      isVerified: false,
    }
  },
  head() {
    return {
      title: 'Get Started | SenexPay',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
            'Take the first bold step on your crypto journey today!. Create an account with SenexPay to begin buying/selling Bitcoin, USDT and more cryptocurrencies seamlessly',
        },
      ],
      link: [
        { rel: 'canonical', href: 'https://app.senexpay.com/create-account' },
      ],
    }
  },
  methods: {
    verifyUser() {
      this.isVerified = true
    },
    saveEmail(newEmail) {
      this.email = newEmail
    },
  },
}
</script>

<style lang="scss" scoped></style>
