<template>
  <div>
    <p class="paragraph paragraph--sm u-fw-700 u-mb-10">Choose Network</p>
    <p class="paragraph paragraph--sm grey-text">
      To display your wallet address and bar code, please choose a network
    </p>
    <p class="paragraph paragraph--sm red-text">
      *Please make sure to choose the correct network as using the wrong network
      can lead to a permanent loss of your coins.
    </p>
    <div class="ntw-list">
      <div
        v-for="(network, idx) in items"
        :key="idx"
        class="ntw-list__item paragraph--sm u-fw-700"
        @click="onSelect(network)"
      >
        {{ network }}

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
    items: {
      type: Array,
      default: () => [],
    },
    activeNetwork: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      selected: '',
    }
  },
  methods: {
    onSelect(network) {
      this.selected = network
      this.$emit('selectedNetwork', network)
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
