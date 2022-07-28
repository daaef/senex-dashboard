<template>
  <div class="index-card">
    <p class="index-card__text u-mb-sm">{{ text }}</p>
    <h1 class="heading-primary u-text-left">
      {{ amount | formatMoney(currency) }}
    </h1>
    <p class="u-mt-15">{{ count }} Orders</p>
  </div>
</template>

<script>
import formatMoney from '~/filters/format-money'
export default {
  filters: {
    formatMoney,
  },
  props: {
    text: {
      type: String,
      default: '',
    },
    amount: {
      type: Number,
      default: 0,
    },
    count: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: 'NGN',
    },
    theme: {
      type: String,
      default: 'dark',
    },
  },
}
</script>

<style></style>
