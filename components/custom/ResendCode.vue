<template>
  <div>
    <span class="resend-badge"
      ><span class="resend" @click="resendCode">Resend code </span
      ><span :class="[showTimer ? '' : 'u-none']"
        >in 00:{{ counter }}</span
      ></span
    >
  </div>
</template>

<script>
export default {
  data() {
    return {
      code: '',
      processing: false,
      counter: 60,
      showTimer: false,
    }
  },
  methods: {
    startCountDown(limit) {
      this.counter = limit
      this.showTimer = true
      const interval = setInterval(() => {
        this.counter--
        if (this.counter <= 0) {
          clearInterval(interval)
          this.showTimer = false
        }
      }, 1000)
    },
    async resendCode() {
      if (this.showTimer === true) {
        return
      }
      this.startCountDown(60)
      this.$emit('action')
    },
  },
}
</script>

<style></style>
