<template>
  <div class="">
    <ConfirmPhone v-if="!confirmPhone" @verify-otp="confirmPhone = true" />
    <VerifyOTP v-else />
  </div>
</template>

<script>
import { mapState } from 'vuex'
// import CardTitle from '@/components/Base/Card/CardTitle'

export default {
  components: {
    // CardTitle
  },
  layout: 'toast',
  auth: 'guest',
  // middleware: 'authenticated',
  head() {
    return {
      title: 'Verify | SenexPay ',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Verify your SenexPay account',
        },
      ],
    }
  },
  data() {
    return {
      confirmPhone: false,
    }
  },
  computed: {
    ...mapState('auth', ['user']),
  },
  beforeMount() {
    if (this.user && this.user.profile) {
      this.confirmPhone = this.user.profile.mobileVerified
    } else {
      this.confirmPhone = false
    }
    // this.confirmPhone = true
  },
}
</script>

<style lang="scss" scoped></style>
