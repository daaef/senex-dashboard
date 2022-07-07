<template>
  <div class="profile profile--min-height-50">
    <div class="u-mb-30">
      <h3 class="heading-primary u-white">You are almost there</h3>
      <p class="text-14">
        You’re close to finishing your account setup. Next up, complete your
        KYC.
      </p>
    </div>
    <div class="u-mb-10">
      <div class="u-flex u-mb-40">
        <img
          src="img/checkmark.svg"
          alt=""
          class="profile__checkmark u-mr-10"
        />
        <p class="text-14">Account Created</p>
      </div>
      <div class="u-flex u-mb-40">
        <img
          src="img/checkmark.svg"
          alt=""
          class="profile__checkmark u-mr-10"
        />
        <p class="text-14">Account Verified</p>
      </div>
      <div class="u-flex">
        <img
          src="img/checkmark-grey.svg"
          alt=""
          class="profile__checkmark u-mr-10"
        />
        <p class="u-fw-600 text-14">KYC Verification</p>
      </div>
    </div>
    <span
      class="u-link u-mb-20 text-14"
      @click="showRegulation = !showRegulation"
      >Why is this important?</span
    >
    <div v-if="showRegulation" class="profile__info u-mt-20">
      <p>
        We are required by government regulations to establish the legitimacy of
        all our customer’s identity to protect all stakeholders against identity
        theft, money laundering, financial fraud, terrorism financing, and other
        financial crimes
      </p>
    </div>
    <BtnSpinner
      :is-in-active="false"
      :is-loading="false"
      value="Complete your KYC"
      setClass="u-mt-20"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      showRegulation: false,
    }
  },
}
</script>

<style></style>
