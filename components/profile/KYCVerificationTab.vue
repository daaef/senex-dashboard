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
      :is-loading="processing"
      value="Complete your KYC"
      setClass="u-mt-20"
      :on-submit="
        () => {
          this.startSession()
        }
      "
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      processing: false,
      showRegulation: false,
      smile_id_products: ['enhanced_kyc', 'biometric_kyc', 'doc_verification'],
    }
  },
  methods: {
    async getWebToken() {
      this.processing = true
      try {
        const data = await this.$api.getSmileToken({ product: 'biometric_kyc' })
        return data
      } catch (err) {
        this.processing = false
      }
    },
    async startSession() {
      const {
        data: { data },
      } = await this.getWebToken()

      const {
        token,
        product,
        callbackUrl,
        environment,
        partnerId,
        signature,
        timestamp,
      } = data

      if (window.SmileIdentity) {
        window.SmileIdentity({
          token,
          product,
          callback_url: callbackUrl,
          environment,
          partner_details: {
            partner_id: partnerId,
            signature,
            timestamp,
            name: 'SenexPay',
            logo_url:
              'https://res.cloudinary.com/senexpay/image/upload/h_30/v1637597559/assets/m/senex-full-logo_ttfeay.png',
            policy_url: 'https://www.senexpay.com/privacy-policy',
            theme_color: '#000',
          },
          id_selection: {
            "NG": ['NIN', 'NIN_SLIP', 'DRIVERS_LICENSE', 'VOTER_ID'],
            "ZA": ['NATIONAL_ID'],
          },
          onSuccess: () => {
            // button.textContent = 'Verify with Smile Identity'
            // button.disabled = false
            // setActiveScreen(demoCompleteScreen)
          },
          onClose: () => {
            // button.textContent = 'Verify with Smile Identity'
            // button.disabled = false
            this.processing = false
          },
          onError: () => {
            // button.textContent = 'Verify with Smile Identity'
            // button.disabled = false
          },
        })
      }
    },
  },
}
</script>

<style></style>
