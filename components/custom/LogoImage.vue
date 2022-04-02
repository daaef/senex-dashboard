<template>
  <span class="auth__logo-box"
    ><a :href="url">
      <img class="auth__logo" src="/img/senexpay-logo-light.svg" alt="senexpay"
    /></a>
  </span>
</template>

<script>
export default {
  data() {
    return {
      url: '',
    }
  },
  mounted() {
    this.url = process.env.SENEX_LANDING_SITE_URL
  },
}
</script>

<style></style>
