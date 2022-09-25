<template>
  <div>
    <ValidToken v-if="validLink" @change-validity="changeValidity" />
    <InvalidToken v-else />
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  layout: 'blank',
  auth: 'guest',
  head() {
    return {
      title: 'Forgot password | SenexPay',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Reset your SenexPay password'
        }
      ]
    }
  },
  data() {
    return {
      processing: false,
      validLink: true
    }
  },
  computed: {
    ...mapState('auth', ['user'])
  },
  mounted() {
    this.verifyToken()
  },
  methods: {
    async verifyToken() {
      const payload = {
        uid: this.$route.params.id,
        token: this.$route.params.token
      }
      this.processing = true
      try {
        await this.$api.activate(payload)
        this.processing = false
        this.validLink = true
      } catch (e) {
        this.processing = false
        this.validLink = false
      }
    },
    changeValidity(valid) {
      this.validLink = valid
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
