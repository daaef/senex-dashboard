<template>
  <div class="u-d-flex u-d-flex--col u-flex-1">
    <div class="o-form__input-box o-form__input-box--bg-dark u-pointer">
      <span class="o-form__input u-dim" @click="openPopUp()">{{
        displayBeneficiary()
      }}</span>
      <img
        src="/img/grey-down-arrow.svg"
        alt="eye"
        class="o-form__input-eye"
        @click="openPopUp()"
      />
    </div>
    <CheckoutButtonSet :down="true" :left="backBtn()" :right="continueBtn()" />
  </div>
</template>

<script>
import { mapState } from 'vuex'

import backBtn from '@/data/defaultBackButton.js'
import continueBtn from '@/data/defaultContinueButton.js'
export default {
  data() {
    return {
      processing: false,
    }
  },
  computed: {
    ...mapState({
      order: (state) => state.order.orderDetail,
      selectedWallet: (state) => state.order.selectedWallet,
      selectedBankAccount: (state) => state.order.selectedBankAccount,
    }),
  },
  methods: {
    backBtn() {
      return {
        ...backBtn,
        isInActive: false,
      }
    },
    continueBtn() {
      return {
        ...continueBtn,
        isInActive: this.isInActive(),
        isLoading: this.processing,
        onSubmit: this.onSubmit,
      }
    },
    async onSubmit() {
      // this.processing = true
      let data = {
        walletAddress: this.selectedWallet.walletAddress,
        walletLabel: this.selectedWallet.label,
      }
      if (this.order.orderType === 'sell') {
        data.accountNumber = this.selectedBankAccount.accountNumber
        data.accountName = this.selectedBankAccount.accountName
        data.bank = this.selectedBankAccount.bank
        data.bankLabel = this.selectedBankAccount.bankName
      }
      this.$emit('getOrderData', data)
    },
    isInActive() {
      if (this.order.orderType === 'sell') {
        if (this.selectedBankAccount.accountNumber == '') {
          return true
        }
        return false
      } else {
        if (this.selectedWallet.walletAddress == '') {
          return true
        }
        return false
      }
    },
    openPopUp() {
      // this.$emit('control-pop-up', true)
      this.$store.commit('order/setOpenList', true)
    },
    displayBeneficiary() {
      if (this.order.orderType == 'buy') {
        return this.selectedWallet.walletAddress != ''
          ? this.selectedWallet.label +
              ' (' +
              this.selectedWallet.walletAddress +
              ')'
          : 'Select Beneficiary'
      } else {
        // console.log('bank account',this.selectedBankAccount.accountName)
        return this.selectedBankAccount.accountName != ''
          ? this.selectedBankAccount.accountName +
              ' (' +
              this.selectedBankAccount.accountNumber +
              ')'
          : 'Select Beneficiary'
      }
    },
  },
}
</script>

<style></style>
