<template>
  <div>
    <div class="checkout">
      <div class="secret-key">
        <h3 class="secret-key__title heading-primary u-mb-medium">SECRET KEY</h3>
        <div class="secret-key__body">
          <label class="paragraph secret-key__label" for="password">Please enter your 3-digit secret key.</label>
          <div class="o-form__input-box u-mb-none">
            <input name="password" type="password" class="o-form__input" />
            <img
              src="/img/eye-on.svg"
              alt="eye"
              class="o-form__input-eye"
            />
          </div>
          <span class="secret-key__error-text">This key is incorrect. Please check and try again</span>
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
                value="Verify key"
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

}
</script>

<style lang="scss">
  
</style>
