<template>
  <div class="invoice__qr-code-box">
    <vue-qrcode
      v-if="qrFallback"
      :value="networkAddress"
      tag="img"
      :options="{ width: 240 }"
    />
    <img v-else :src="qrCode" class="invoice__qr-img u-mb-small" :alt="networkAddress" />
    <span class="paragraph paragraph--sm paragraph--600 u-mb-small">Scan with your Crypto Wallet app to pay</span>
    <div class="invoice__copy-address u-mb-small"
      v-tooltip="{
        content: copyText,
        show: copyText != '' ? true : false,
        trigger: 'manual',
        placement: 'top-center'
      }"
      v-clipboard="networkAddress"
      v-clipboard:success="toggleCopyText"
    >
      <img
        src="/img/copy-icon.svg"
        alt="copy"
      />
      <span
        id="tp-1"
        class="paragraph paragraph--sm paragraph--600"
        >Copy wallet address</span
      >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    qrFallback: {
      default: null
    }
  }
}
</script>

<style>

</style>