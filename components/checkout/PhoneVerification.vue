<template>
  <div>
    <div class="checkout checkout--no-min-height">
      <div class="secret-key">
        <h3 class="secret-key__title heading-primary u-mb-40">
          PHONE VERIFICATION
        </h3>
        <div class="secret-key__body">
          <label class="paragraph secret-key__label" for="password"
            >Please enter the 6-digit code sent to 09xxxxx8934.</label
          >
          <div class="o-form__input-box u-mb-none">
            <input name="password" type="password" class="o-form__input" />
            <img src="/img/eye-on.svg" alt="eye" class="o-form__input-eye" />
          </div>
          <span v-if="verifyError" class="secret-key__error-text"
            >This code is incorrect. Please check and try again</span
          >
          <div class="secret-key__btn-box">
            <div class="secret-key__btn-small">
              <ButtonSpinner
                :is-loading="false"
                :is-in-active="true"
                value="Cancel"
                background="#A9CAFC"
                color="#053888"
              />
            </div>
            <div class="secret-key__btn-big">
              <ButtonSpinner
                :is-loading="false"
                :is-in-active="true"
                value="Verify code"
                background="#053888"
              />
            </div>
          </div>
          <span class="secret-key__resend"><a> Resend </a> OTP</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      verifyError: false,
    }
  },
}
</script>

<style lang="scss"></style>
