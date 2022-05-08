<template>
  <div class="checkout">
    <Checkout />
    <div class="checkout__body u-flex-1">
      <h6 class="paragraph">Do you have a senexpay account?</h6>
      <div class="chkout-acc">
        <div class="chkout-acc__select-box u-mb-40">
          <div
            class="chkout-acc__select-btn"
            :class="[
              isSelected && hasAccount ? 'chkout-acc__select-btn--active' : '',
            ]"
            @click="selectYes()"
          >
            Yes
          </div>
          <div
            class="chkout-acc__select-btn"
            :class="[
              isSelected && !hasAccount ? 'chkout-acc__select-btn--active' : '',
            ]"
            @click="selectNo()"
          >
            No
            <!-- <input type="radio" class="radio-2" /><label class="chkout-tab-box__label">No</label> -->
          </div>
          <span
            class="chkout-acc__glider"
            :class="[
              hasAccount ? 'chkout-acc__glider--1' : 'chkout-acc__glider--2',
              !isSelected ? 'chkout-acc__glider--hide' : '',
            ]"
          ></span>
          <!-- <div
            class="chkout-acc__select-btn"
            :class="isSelected && !hasAccount ? 'chkout-acc__select-btn--active' : ''"
            @click="selectNo()"
          >
            No
          </div> -->
        </div>
      </div>

      <div v-if="isSelected && hasAccount">
        <MiniLogin
          :order="order"
          @change-sign-in-val="changeSignInVal"
          @setName="setName"
        />
      </div>
      <div v-else-if="isSelected && !hasAccount">
        <div v-if="signUpStep === 1">
          <QuickSignUp
            :firstName.sync="firstName"
            :lastName.sync="lastName"
            @change-sign-up-step="changeSignUpStep"
          />
        </div>
        <div v-else-if="signUpStep === 2">
          <LittleMoreInfo
            :email.sync="email"
            :mobileSuffix.sync="mobileSuffix"
            :countryCode.sync="countryCode"
            :isEmailValid.sync="isEmailValid"
            :isMobileValid.sync="isMobileValid"
            :mobile="mobile"
            @change-sign-up-step="changeSignUpStep"
            @change-sign-in-val="changeSignInVal"
          />
        </div>
        <div v-else>
          <RegisterFinalStep
            :password.sync="password"
            :firstName="firstName"
            :lastName="lastName"
            :email="email"
            :mobile="mobile"
            :isPasswordValid="isPasswordValid"
            @change-sign-up-step="changeSignUpStep"
            @validateInfo="validatePassword"
          />
        </div>
      </div>
      <div v-if="!isSelected" class="u-mt-auto">
        <CheckoutButtonSet />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      isSelected: false,
      hasAccount: false,
      signUpStep: 1,
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      mobileSuffix: '',
      countryCode: '+234',
      password: '',
      isPasswordValid: false,
      isEmailValid: false,
      isMobileValid: false,
    }
  },
  watch: {
    mobileSuffix(value) {
      if (this.countryCode === '+234' && value.length === 10) {
        this.mobile = '+234' + value
      } else if (this.countryCode === '+27' && value.length === 9) {
        this.mobile = '+27' + value
      }
    },
  },
  mounted() {
    this.$store.commit('order/changeCurrentOrderStep', 2)
  },
  computed: {
    ...mapState({
      order: (state) => state.order.orderDetail,
    }),
  },
  methods: {
    selectYes() {
      this.isSelected = true
      this.hasAccount = true

      this.$ga.event({
        eventCategory: 'Checkout authentication',
        eventAction: 'click-has-account-option',
        eventLabel: 'Sign in',
        eventValue: 1,
      })
    },
    selectNo() {
      this.isSelected = true
      this.hasAccount = false

      this.$ga.event({
        eventCategory: 'Checkout authentication',
        eventAction: 'click-has-account-option',
        eventLabel: 'Create account',
        eventValue: 1,
      })
    },
    changeSignUpStep(val) {
      this.signUpStep = val
    },
    changeSignInVal(val) {
      this.$emit('change-signed-in-val-to', val)
    },
    setName(first, last) {
      this.firstName = first
      this.lastName = last
    },
    validateLittleInfo(val) {
      this.isLittleInfoValid = val
      // console.log('validInfo', this.isLittleInfoValid)
    },
    validatePassword(val) {
      this.isPasswordValid = val
    },
  },
}
</script>

<style></style>
