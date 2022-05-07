<template>
  <div class="checkout u-text-center">
    <div class="u-flex-1 u-d-flex u-d-flex--col u-d-flex--align-center u-d-flex--justify-center u-p-20">
      <!-- <span class="heading-primary">👏</span> -->
      <template v-if="!checking">
        <img src="/img/clapping-emoji.png" alt="clap" class="clap u-mb-sm">
        <span class="heading-primary u-mb-sm">KYC LIMIT</span>
        <div class="kyc-1-content u-mb-sm">
          <p class="paragraph u-mb-5">Clap clap. You hit the big leagues!</p>
          <p class="paragraph">To trade above $40, please complete your KYC.</p>
        </div>
        <a href="/profile" target="_blank" @click="checking = true" class="u-btn u-mb-sm">Complete KYC</a>
        <span @click="terminateAndStartNew" class="u-color-primary u-pointer">I'll trade a lower amount instead.</span>
      </template>
      <template v-else>
        <div class="loading-circle u-mb-sm">
          <span class="loading-circle__dot loading-circle__dot--red"></span>
          <span class="loading-circle__dot loading-circle__dot--yellow"></span>
          <span class="loading-circle__dot loading-circle__dot--purple"></span>
          <span class="loading-circle__dot loading-circle__dot--blue"></span>
        </div>
        <span class="heading-primary u-mb-sm">KYC VERIFICATION PENDING</span>
        <div class="kyc-1-content u-mb-sm">
          <p class="paragraph">
            Please hold tight, we are waiting for your KYC verification before you can continue...
          </p>
        </div>
        <button @click="terminateAndStartNew" class="u-btn u-mb-sm">Create new trade</button>
        <a href="/profile" target="_blank" class="u-color-primary u-pointer">Complete your KYC</a>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checking: false
    }
  },
  methods: {
    terminateSession() {
      this.$cookiz.remove('a2snXbe')
      this.$cookiz.remove('eJ6Ydkmr035')
      this.$cookiz.remove('ftyp5h2nl')
    },
    terminateAndStartNew() {
      this.terminateSession()
      this.$router.push('/order/start')
    }
  }
}
</script>

<style>
.clap {
  width: 40px;
  height: auto;
}

.kyc-1-content {
  width: 90%;
  text-align: center;
}
</style>