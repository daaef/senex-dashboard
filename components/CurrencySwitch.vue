<template>
  <div>
    <div class="topbar-switch">
      <span
        v-for="(item, idx) in fiatCurrencies"
        class="topbar-switch__item"
        :key="idx"
        @click="() => handleClick(idx)"
        ><img :src="item.flag" alt="country" /> {{ item.ticker }}</span
      >
      <span
        class="topbar-switch__glider"
        :class="[`topbar-switch__glider--${getSelectedFiatIdx() + 1}`]"
      ></span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {}
  },
  computed: {
    ...mapState({
      fiatCurrencies: (state) => state.fiatCurrencies,
      selectedFiatCurrency: (state) => state.selectedFiatCurrency,
    }),
  },
  methods: {
    handleClick(idx) {
      this.$store.commit('setSelectedFiatCurrency', this.fiatCurrencies[idx])
    },
    getSelectedFiatIdx() {
      return this.fiatCurrencies.findIndex(
        (item) => item.ticker === this.selectedFiatCurrency.ticker
      )
    },
  },
}
</script>

<style></style>
