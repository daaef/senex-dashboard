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
        <div class="txn-tab__arrow-box">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="11.115"
            height="18"
            viewBox="0 0 11.115 18"
            class="icon"
          >
            <path
              id="Icon_material-navigate-next"
              data-name="Icon material-navigate-next"
              d="M21.885,9,24,11.115,17.13,18,24,24.885,21.885,27l-9-9Z"
              transform="translate(-12.885 -9)"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="11.115"
            height="18"
            viewBox="0 0 11.115 18"
            class="icon"
          >
            <path
              id="Icon_material-navigate-next"
              data-name="Icon material-navigate-next"
              d="M15,9l-2.115,2.115L19.755,18l-6.87,6.885L15,27l9-9Z"
              transform="translate(-12.885 -9)"
            />
          </svg>
        </div>
      </div>
    </div>
    <bank-account-table :bankAccounts="getBankAccounts()"></bank-account-table>
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
    getBankAccounts() {
      if (this.user && this.user.profile.bankAccounts) {
        return this.user.profile.bankAccounts.data
      }
      return []
    },
  },
}
</script>

<style></style>
