<template>
  <div class="ntw-switch">
    <p class="paragraph paragraph--sm m-0 u-mb-10">Select your wallet type</p>
    <div class="ntw-switch__select-box">
      <div
        v-for="(network, index) in Object.keys(items)"
        :key="index"
        class="ntw-switch__select-btn"
        :class="[network == selected ? 'ntw-switch__select-btn--active' : '', `ntw-switch__select-btn--${Object.keys(items).length}`]"
        @click="onSelect(index+1, network)"
      >
        {{ network }}
      </div>
      <span class="ntw-switch__glider"
        :class="
          `ntw-switch__glider--${tab} ntw-switch__glider--w${Object.keys(items).length}`
        "></span
      >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Object,
      default: () => ({})
    },
    activeNetwork: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tab: this.getInitialTabIdx(),
      selected: this.activeNetwork
    }
  },
  methods: {
    onSelect(tabIdx, network) {
      this.tab = tabIdx
      this.selected = network
      this.$emit('selectedNetwork', network)
      //console.log('activeNetwork', this.activeNetwork)
    },
    getInitialTabIdx() {
      let arr = Object.keys(this.items)

      let tabIdx = arr.findIndex(x => x === this.activeNetwork)
      // console.log('tab', tabIdx)
      return tabIdx + 1
      // console.log('tab', this.items)
      // return 1
    }
  }
}
</script>

<style></style>
