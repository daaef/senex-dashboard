<template>
  <div class="profile profile--min-height-50">
    <div class="u-mb-30">
      <h3 class="heading-primary u-white">
        {{
          isApproved
            ? 'Your KYC Verification is complete'
            : 'You are almost there'
        }}
      </h3>
      <p v-if="isApproved" class="text-10">
        Now you can enjoy all the goodies SenexPay has to offer, <br />
        including limitless transactions.
      </p>
      <p v-else class="text-10">
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
        <p class="text-13">Account Created</p>
      </div>
      <div class="u-flex u-mb-40">
        <img
          src="img/checkmark.svg"
          alt=""
          class="profile__checkmark u-mr-10"
        />
        <p class="text-13">Account Verified</p>
      </div>
      <div class="u-flex">
        <img
          :src="isApproved ? 'img/checkmark.svg' : 'img/checkmark-grey.svg'"
          alt=""
          class="profile__checkmark u-mr-10"
        />
        <p class="u-fw-600 text-13">KYC Verification</p>
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
      v-if="!isApproved"
      :is-in-active="isUnderReview"
      :is-loading="processing"
      :value="isDeclined ? 'Re-submit KYC' : 'Complete your KYC'"
      setClass="u-mt-20"
      :on-submit="
        () => {
          this.startSession()
        }
      "
    />
    <p v-if="isUnderReview" class="text-14" style="color: #FFCCCC; padding-top: 12px;">
      <em> Your submission is being reviewed </em>
    </p>
    <p v-if="isDeclined" class="text-14" style="color: #FFCCCC; padding-top: 12px;">
      <em> {{ user.profile.statusResultText }} </em>
    </p>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      processing: false,
      submitted: false,
      showRegulation: false,
      smile_id_products: ['enhanced_kyc', 'biometric_kyc', 'doc_verification'],
    }
  },
  computed: {
    ...mapState('auth', ['user']),
    isApproved() {
      return this.user.profile.status == 'Approved'
    },
    isDeclined() {
      return this.user.profile.status == 'Declined'
    },
    isUnderReview() {
      return (
        ['Under review', 'Provisional'].includes(this.user.profile.status) ||
        this.submitted
      )
    },
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
            'NG': ['NIN', 'NIN_SLIP', 'DRIVERS_LICENSE', 'VOTER_ID'],
            'ZA': ['NATIONAL_ID'],
          },
          onSuccess: () => {
            this.$api.notifySubmission()
            this.processing = false
            this.submitted = true
          },
          onClose: () => {
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
