<template>
  <div>
    <div class="topbar-switch">
      <span
        v-for="(item, idx) in fiatCurrencies"
        class="topbar-switch__item"
        :key="idx"
        @click="() => handleClick(idx)"
        >{{ item.ticker }}</span
      >
      <span
        class="topbar-switch__glider"
        :class="[`topbar-switch__glider--${currentIdx}`]"
      ></span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      currentIdx: 1,
    }
  },
  computed: {
    ...mapState({
      fiatCurrencies: (state) => state.fiatCurrencies,
    }),
  },
  methods: {
    handleClick(idx) {
      this.currentIdx = idx + 1
      this.$store.commit('setSelectedFiatCurrency', this.fiatCurrencies[idx])
    },
  },
}
</script>

<style></style>
