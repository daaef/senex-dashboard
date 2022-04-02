<template>
  <div class="txn-tab">
    <div class="txn-tab__header u-my-30">
      <div class="txn-tab__search-box">
        <img src="h.png" alt="" class="txn-tab__search-icon" />
        <input type="text" class="txn-tab__search-input" placeholder="Search" />
      </div>
      <div class="txn-tab__page-box">
        <button class="btn u-mr-20">{{ btnText }}</button>
        <span>1-16 of 16</span>
        <div class="txn-tab__arrow-box"></div>
      </div>
    </div>
    <wallet-table :wallets="getWallets()"></wallet-table>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    btnText: {
      type: String,
      default: '',
    },
  },
  computed: {
    ...mapState('auth', ['user']),
  },
  methods: {
    getWallets() {
      if (this.user && this.user.profile.walletAddresses) {
        return this.user.profile.walletAddresses.data
      }
      return []
    },
  },
}
</script>

<style></style>
