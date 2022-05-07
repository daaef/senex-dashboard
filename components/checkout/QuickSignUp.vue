<template>
  <div>
    <div class="u-mb-mini-medium">
      <h3 class="heading-primary u-d-flex u-d-flex--h-center">
        Quick SIGN UP
        <span
          id="tp-1"
          class="u-info-icon"
          data-toggle="tooltip"
          v-tooltip="{
            content:
              'For your security, trades above $50 are required to sign up before check- out.!',
            placement: 'right',
          }"
          >i</span
        >
        <!-- <b-tooltip
          target="tp-1"
          title="For your security, trades above $50 are required to sign up before check- out.!"
          placement="right"
          variant="light"
        >
        </b-tooltip> -->
      </h3>
      <p class="paragraph">
        Let’s get some details so you can continue trading
      </p>
    </div>
    <form action="#" class="o-form">
      <label class="paragraph" for="firstname">First Name</label>
      <div class="o-form__input-box">
        <input
          :value="firstName"
          @input="$emit('update:firstName', $event.target.value)"
          name="firstname"
          type="text"
          class="o-form__input"
        />
      </div>
      <label class="paragraph" for="lastname">Last Name</label>
      <div class="o-form__input-box">
        <input
          :value="lastName"
          @input="$emit('update:lastName', $event.target.value)"
          name="lastname"
          type="text"
          class="o-form__input"
        />
      </div>
    </form>
    <CheckoutButtonSet :left="backBtn()" :right="continueBtn()" />
  </div>
</template>

<script>
import backBtn from '@/data/defaultBackButton.js'
import continueBtn from '@/data/defaultContinueButton.js'
export default {
  props: {
    firstName: {
      type: String,
      default: '',
    },
    lastName: {
      type: String,
      default: '',
    },
  },
  data() {
    return {}
  },
  methods: {
    continueBtn() {
      return {
        ...continueBtn,
        isInActive: !this.firstName || !this.lastName,
        onSubmit: () => {
          this.$emit('change-sign-up-step', 2)
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
  },
}
</script>

<style></style>
