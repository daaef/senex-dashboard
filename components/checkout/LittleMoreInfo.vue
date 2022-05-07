<template>
  <div>
    <div class="u-mb-mini-medium">
      <h3 class="heading-primary">JUST A little MORE info</h3>
      <p class="paragraph">Keeping your transaction tight for you…</p>
    </div>
    <form action="#" class="o-form">
      <label class="paragraph" for="firstname">Email</label>
      <div class="o-form__input-box">
        <input
          :value="email"
          @input="$emit('update:email', $event.target.value)"
          name="email"
          type="email"
          class="o-form__input"
        />
      </div>
      <label class="paragraph" for="phoneNumber">Phone Number</label>
      <div
        class="o-form__input-box o-form__input-box--flex o-form__input-box--overflow-v"
      >
        <b-dropdown id="dropdown-menu" :text="countryCode">
          <b-dropdown-item
            v-for="country in countries"
            :key="country.value"
            :value="countryCode"
            @click="changeCountryCode(country.value)"
          >
            {{ country.text }}
          </b-dropdown-item>
        </b-dropdown>
        <input
          :value="mobileSuffix"
          @input="$emit('update:mobileSuffix', $event.target.value)"
          name="phoneNumber"
          type="text"
          class="o-form__input"
          @keypress="isNumber"
          autocomplete="off"
        />
      </div>
      <div class="checkout__btn-box">
        <div class="checkout__btn">
          <ButtonSpinner
            :is-loading="continueBtn().isLoading"
            :is-in-active="continueBtn().isInActive"
            :value="continueBtn().value"
            :on-submit="continueBtn().onSubmit"
            :background="continueBtn().background"
          />
        </div>
      </div>
    </form>
    <!-- <CheckoutButtonSet :left="backBtn()" :right="continueBtn()" /> -->
    <vue-final-modal id="verify-phone" v-model="openModal" no-close-on-backdrop>
      <div class="benef-overlay container">
        <MiniPhoneVerification
          :mobile="mobile"
          :email="email"
          @controlModal="controlModal"
          @proceedToPassword="proceedToPassword"
        />
      </div>
    </vue-final-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import backBtn from '@/data/defaultBackButton.js'
import continueBtn from '@/data/defaultContinueButton.js'
export default {
  props: {
    email: {
      type: String,
      default: '',
    },
    mobileSuffix: {
      type: String,
      default: '',
    },
    countryCode: {
      type: String,
      default: '',
    },
    mobile: {
      type: String,
      default: '',
    },
    isEmailValid: {
      type: Boolean,
      default: false,
    },
    isMobileValid: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      openModal: false,
      processing: false,
      countries: [
        {
          value: '+234',
          text: 'Nigeria +234',
        },
        {
          value: '+27',
          text: 'South Africa +27',
        },
      ],
    }
  },
  computed: {
    ...mapState({
      order: (state) => state.order.orderDetail,
    }),
  },
  watch: {
    mobileSuffix(value) {
      // this.mobileSuffix = value
      this.validateMobile(value)
    },
    email(value) {
      // this.email = value
      this.validateEmail(value)
    },
  },
  methods: {
    continueBtn() {
      return {
        ...continueBtn,
        isInActive: !this.isEmailValid || !this.isMobileValid,
        isLoading: this.processing,
        onSubmit: () => {
          this.verifyCredentials()
          // this.$emit('change-sign-up-step', 3)
        },
      }
    },
    backBtn() {
      return {
        ...backBtn,
        isInActive: false,
        onSubmit: () => {
          this.$emit('change-sign-up-step', 1)
        },
      }
    },
    controlModal(val) {
      this.openModal = val
    },
    proceedToPassword() {
      this.$emit('change-sign-up-step', 3)
    },
    async verifyCredentials() {
      const payload = {
        email: this.email,
        mobile: this.mobile,
      }
      this.processing = true
      this.$axios
        .post('/verify/credentials', payload)
        //.post('/verify/credentials', payload)
        .then((res) => {
          this.openModal = true
          this.processing = false
          const pin = res.data.details.data.pinId
          localStorage.setItem('pinId', pin)
          // popup login and change mode
          // this.proceedToPassword()
        })
        .catch((err) => {
          const {
            response: { data },
          } = err
          this.$notify({
            type: 'error',
            text: data.message, // error.response.data.message
          })
          this.processing = false
          return
        })
    },
    async emailCheck() {
      this.processing = true
      const payload = {
        email: this.email,
        cryptoAmount: this.order.cryptoAmount,
        type: this.order.orderType,
        rate: this.order.cryptoFiatRate,
      }
      // const payload = {
      //   email: this.email,
      //   mobileNumber: this.mobileNumber
      // }

      this.$axios
        .post('/email/check', payload)
        //.post('/verify/credentials', payload)
        .then((res) => {
          // popup login and change mode
          if (res.data.isUser) {
            this.$notify({
              type: 'error',
              text: 'Account with this email already exists. Kindly sign in.',
            })
            this.processing = false
            return
          }
          this.processing = false
        })
        .catch((err) => {
          const {
            response: { data, status },
          } = err
          this.processing = false
          if (status === 400) {
            if (data.isUser) {
              // this.errorMessage = data.message
              // if (data.message.includes('limit exceeded')) this.signIn = true
              this.$notify({
                type: 'error',
                text: data.message, // error.response.data.message
              })
              return
            } //else {
            //   this.sendOTP()
            // }
            this.proceedToPassword()
            return
          }
          //this.processing = false

          // this.loading = false
          this.$notify({
            type: 'error',
            text: data.message,
          })
          return
        })
    },
    async sendOTP() {
      const payload = {
        type: 'Generic',
        newMobile: this.mobile,
      }
      // this.processing = true
      try {
        // const { data } = await this.$axios.post('/otp/send', payload) //this.$api.sendOTP(payload)
        // localStorage.setItem('pinId', data.details.pinId)
        // this.processing = false
        this.openModal = true
        // this.$emit('verify-otp')
      } catch (error) {
        this.processing = false
        this.$notify({
          type: 'error',
          text: error.response.data.message,
        })
        // this.$toast.open({
        //   message: error.response.data.message,
        //   type: 'error',
        //   position: 'top-right'
        // })
      } finally {
        this.processing = false
      }
    },
    isAllValid() {
      if (this.validEmail === 2 && this.validMobile === 2) {
        this.$emit('validateInfo', true)
      } else {
        this.$emit('validateInfo', false)
      }
    },
    validateEmail(value) {
      const reg =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/
      if (reg.test(value)) {
        this.$emit('update:isEmailValid', true)
      } else {
        this.$emit('update:isEmailValid', false)
      }
      // this.isAllValid()
    },
    validateMobile(value) {
      if (this.countryCode === '+234' && value.length === 10) {
        // this.mobile = '+234' + value
        // this.validMobile = 2
        this.$emit('update:isMobileValid', true)
      } else if (this.countryCode === '+27' && value.length === 9) {
        // this.mobile = '+27' + value
        // this.validMobile = 2
        this.$emit('update:isMobileValid', true)
      } else {
        // this.validMobile = 1
        this.$emit('update:isMobileValid', false)
      }
      // this.isAllValid()
    },
    isNumber(evt) {
      if (this.countryCode === '+234' && this.mobileSuffix.length === 10) {
        evt.preventDefault()
      } else if (this.countryCode === '+27' && this.mobileSuffix.length === 9) {
        evt.preventDefault()
      }
      const charCode = evt.which ? evt.which : evt.keyCode
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        evt.preventDefault()
      }
    },
    changeCountryCode(countryValue) {
      this.$emit('update:countryCode', countryValue)
      this.$emit('update:mobileSuffix', '')
    },
  },
}
</script>

<style lang="scss" scoped>
// /deep/ #dropdown-menu > button {
//   width: 100%;
//   height: 100%;
//   background-color: white;
//   color: black;
//   margin-right: 5px;
//   // position: absolute;
// }

// /deep/ #dropdown-menu__BV_toggle_ {
//   width: 100%;
//   border: 1px solid #b2b2b2;
//   margin-right: 10px;
// }

// /deep/ .dropdown-menu {
//   border: 1px solid #b2b2b2;
//   margin-top: 5px;
// }

// /deep/ #verify-phone___BV_modal_content_ {
//   background-color: transparent;
//   border: transparent;
//   padding: 0 !important;
//   width: 450px !important;
//   overflow: hidden;
//   margin: auto;
// }

// /deep/ #verify-phone___BV_modal_body_ {
//   padding: 0 !important;
//   width: 100% !important;
// }
</style>
