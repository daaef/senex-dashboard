<template>
  <div>
    <div class="loading-overlay">
      <div class="loading-overlay__circle">
        <span class="loading-overlay__dot loading-overlay__dot--red"></span>
        <span class="loading-overlay__dot loading-overlay__dot--yellow"></span>
        <span class="loading-overlay__dot loading-overlay__dot--purple"></span>
        <span class="loading-overlay__dot loading-overlay__dot--blue"></span>
      </div>
      <p class="loading-overlay__text">{{ getText() }}</p>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    getText() {
      return this.$store.state.order.loadingDetails.text
    }
  }
}
</script>

<style>

</style>