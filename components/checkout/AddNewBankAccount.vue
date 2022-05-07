<template>
  <div class="u-d-flex u-d-flex--col u-flex-1">
    <label class="paragraph" for="accountNumber">New Beneficiary Details</label>
    <div class="o-form__input-box">
      <input v-model="accountNumber" name="accountNumber" type="text" class="o-form__input" placeholder="Enter bank account number" />
    </div>
    <div class="o-form__input-box u-pointer" @click="openPopUp()">
      <span class="o-form__input u-dim">{{ selectedBank.label === '' ? 'Select your bank' : selectedBank.label }}</span>
      <img
        src="/img/grey-down-arrow.svg"
        alt="eye"
        class="o-form__input-eye"
        @click="openPopUp()"
      />
    </div>
    <div class="o-form__input-box o-form__input-box--bg-dark">
      <span class="o-form__input u-dim">{{ !accountName ? 'Beneficiary' : accountName }}</span>
    </div>
    <CheckoutButtonSet :down="true" :left="backBtn()" :right="continueBtn()" />
  </div>
</template>

<script>
import { mapState } from 'vuex'

import backBtn from '@/data/defaultBackButton.js'
import continueBtn from '@/data/defaultContinueButton.js'

export default {
  layout: 'order',
  data() {
    return {
      accountNumber: '',
      accountName: '',
      processing: false
    }
  },
  computed: {
    ...mapState({
      order: state => state.order.orderDetail,
      selectedBank: state => state.order.selectedBank,
      beneficiaries: state => state.order.beneficiaries,
      signedIn: state => state.order.signedIn
    })
  },
  watch: {
    accountNumber(val) {
      if (val.length === 10 && this.selectedBank.label) {
        this.accountVerification()
      } else {
        this.accountName = ''
      }
    },
    selectedBank(val) {
      if (val !== {} && this.accountNumber.length === 10) {
        this.accountVerification()
      } else {
        this.accountName = ''
      }
    }
  },
  methods: {
    continueBtn() {
      return {
        ...continueBtn,
        isInActive: !this.accountName,
        isLoading: this.processing,
        onSubmit: () => { this.addRecipientAndPlaceOrder() }
      }
    },
    backBtn() {
      return {
        ...backBtn,
        isInActive: false,
        onSubmit: this.cancelTransaction
      }
    },
    openPopUp() {
      // this.$emit('control-pop-up', true)
       this.$store.commit('order/setOpenList', true)
    },
    async accountVerification() {
      // this.processing = true
      this.$store.commit('order/changeLoading', {show: true, text: 'Fetching beneficiary name...'})
      try {
        const { data: { data }} = await this.$axios.post('https://api.ravepay.co/flwv3-pug/getpaidx/api/resolve_account',
        {
          recipientaccount: this.accountNumber,
          destbankcode: this.selectedBank.value,
          PBFPubKey: 'FLWPUBK-0e398537e56c2d2e0ae05fceb68a9590-X'
        })

        this.accountName = data.data.accountname
        if (data.data.accountname == null || data.data.accountname == '' || data.data.accountname == 'null') {
          // this.$store.commit('order/changeLoading', {show: false})
          this.$notify({
            type: 'error',
            text: 'Account number and bank mismatch.' // error.response.data.message
          })
        }
        this.$store.commit('order/changeLoading', {show: false, text: ''})
      } catch(e) {
          this.$store.commit('order/changeLoading', {show: false, text: ''})
          this.$notify({
            type: 'error',
            text: 'Account number and bank mismatch.' // error.response.data.message
          })
      } finally {
        // console.log('accout name',this.accountName)
        // this.processing = false
      }
    },
    async addRecipientAndPlaceOrder() {
      this.processing = true
      const id = Date.now()
      const payload = {
        id,
        currency: this.order.fiatCurrency,
        accountNumber: this.accountNumber,
        accountName: this.accountName,
        bank: this.selectedBank.value,
        bankName: this.selectedBank.label
      }
      // this.$store.commit('order/addBeneficiary', { ...payload, bankLabel: this.selectedBank.label })
      this.$store.dispatch('order/addBeneficiary', { ...payload, bankLabel: this.selectedBank.label })

      if (this.signedIn == 1) {
        this.getOrderData()
      } else if (this.signedIn == 2) {
          try{
            await this.$api.updateProfile({bankAccounts: {
              data: this.beneficiaries
            }})
            this.getOrderData()
            // console.log(data)
          } catch (e) {
            // console.log(e)
            // this.fetchBeneficiaries()
          } finally {
            this.processing = false
          }
      }
      
    },
    getOrderData() {
      const data = {
        accountNumber: this.accountNumber,
        accountName: this.accountName,
        bank: this.selectedBank.value,
        bankLabel: this.selectedBank.label
      }
      this.$emit('getOrderData', data)
    },
    terminateSession() {
      this.$cookiz.remove('a2snXbe')
      this.$cookiz.remove('eJ6Ydkmr035')
      this.$cookiz.remove('ftyp5h2nl')
    },
    cancelTransaction() {
      this.terminateSession()
      this.$router.push('/order/start')
    }
  }
}
</script>

<style></style>