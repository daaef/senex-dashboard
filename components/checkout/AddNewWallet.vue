<template>
  <div class="u-d-flex u-d-flex--col u-flex-1">
    <label class="paragraph" for="accountNumber">New Beneficiary Details</label>
    <div class="o-form__input-box">
      <input
        v-model="address"
        name="address"
        type="text"
        class="o-form__input"
        placeholder="Enter wallet address"
      />
    </div>
    <div class="o-form__input-box">
      <input
        v-model="label"
        name="label"
        type="text"
        class="o-form__input"
        placeholder="Enter a nickname"
      />
    </div>
    <CheckoutButtonSet :down="true" :left="backBtn()" :right="continueBtn()" />
    <vue-final-modal id="wallet-confirm" v-model="openModal">
      <div class="benef-overlay container">
        <WalletDoubleCheck
          :address="address"
          :label="label"
          @controlModal="controlModal"
          @addRecipientAndPlaceOrder="addRecipientAndPlaceOrder"
        />
      </div>
    </vue-final-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import backBtn from '@/data/defaultBackButton.js'
import continueBtn from '@/data/defaultContinueButton.js'
import {
  COOKIE_SAVED_CHECKOUT,
  COOKIE_SAVED_ORDER,
  COOKIE_SAVED_ORDER_REVIEW_BENEF,
  COOKIE_SAVED_RATE_OBJECT,
} from '~/data/constants'

export default {
  data() {
    return {
      address: '',
      label: '',
      openModal: false,
    }
  },
  computed: {
    ...mapState({
      order: (state) => state.order.orderDetail,
      beneficiaries: (state) => state.order.beneficiaries,
      signedIn: (state) => state.order.signedIn,
    }),
  },
  methods: {
    continueBtn() {
      return {
        ...continueBtn,
        isInActive: !this.address || !this.label,
        onSubmit: () => {
          this.controlModal(true)
        },
      }
    },
    backBtn() {
      return {
        ...backBtn,
        isInActive: false,
        onSubmit: this.cancelTransaction,
      }
    },
    controlModal(val) {
      this.openModal = val
    },
    async addRecipientAndPlaceOrder() {
      const id = Date.now()
      const payload = {
        id,
        label: this.label,
        currency: this.order.cryptoCurrency,
        walletAddress: this.address,
      }

      // this.$store.commit('order/addBeneficiary', payload)
      this.$store.dispatch('order/addBeneficiary', payload)

      if (this.signedIn == 1) {
        this.getOrderData()
      } else if (this.signedIn == 2) {
        try {
          await this.$api.updateProfile({
            walletAddresses: {
              data: this.beneficiaries,
            },
          })
          this.getOrderData()
        } catch (e) {
          // console.log(e)
          // this.fetchBeneficiaries()
        }
      }
    },
    getOrderData() {
      let data = {
        walletAddress: this.address,
        walletLabel: this.label,
      }
      this.controlModal(false)
      this.$emit('getOrderData', data)
    },
    terminateSession() {
      this.$cookiz.remove(COOKIE_SAVED_ORDER)
      this.$cookiz.remove(COOKIE_SAVED_RATE_OBJECT)
      this.$cookiz.remove(COOKIE_SAVED_CHECKOUT)
      this.$cookiz.remove(COOKIE_SAVED_ORDER_REVIEW_BENEF)
    },
    cancelTransaction() {
      this.terminateSession()
      this.$router.push('/order/start')
    },
  },
}
</script>

<style lang="scss" scoped>
// .modal-huge {
//   max-width: 450px !important;
//   width: 100%;
//   padding: 0 !important;
// }

// /deep/ #wallet-confirm___BV_modal_content_ {
//   background-color: transparent;
//   border: transparent;
//   padding: 0 !important;
//   width: 450px !important;
//   overflow: hidden;
//   margin: auto;
// }

// /deep/ #wallet-confirm___BV_modal_body_ {
//   padding: 0 !important;
//   width: 100% !important;
// }
</style>
