<template>
  <div class="index-card">
    <p class="index-card__text u-mb-sm">{{ text }}</p>
    <h1 class="heading-primary u-text-left">{{ amount }}</h1>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: '',
    },
    amount: {
      type: String,
      default: '0.00',
    },
    theme: {
      type: String,
      default: 'dark',
    },
  },
}
</script>

<style></style>
