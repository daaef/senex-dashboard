<template>
  <div>
    <p class="paragraph paragraph--sm u-fw-700 u-mb-10">Choose Provider</p>
    <p class="paragraph paragraph--sm grey-text">To select payment method</p>
    <p class="paragraph paragraph--sm red-text">
      *Please make sure to choose the correct provider as using the wrong
      provider can lead to a permanent loss of your funds.
    </p>
    <div class="ntw-list">
      <div
        v-for="(provider, idx) in providers"
        :key="idx"
        class="ntw-list__item paragraph--sm u-fw-700"
        @click="onSelect(provider)"
      >
        {{ provider.displayName }}
        <em class="u-fw-400">({{ provider.serviceType }})</em>

        <img src="/img/awesome-arrow-down.svg" alt="right arrow" />
      </div>
    </div>
    <!-- <div class="invoice__sell-instruct u-mb-20">
      <span class="paragraph paragraph--sm u-fw-600">Please do not refresh this page. We would automatically detect when you make your Crypto deposit.</span>
    </div> -->
  </div>
</template>

<script>
export default {
  props: {
    providers: {
      type: Array,
      default: () => [],
    },
    activeProvider: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      selected: {},
    }
  },
  methods: {
    onSelect(provider) {
      this.selected = provider
      this.$emit('setSelectedProvider', provider)
    },
  },
}
</script>

<style scoped>
.grey-text {
  color: #838384;
}
.red-text {
  color: #f8486a;
  margin-top: 5px;
}
</style>
