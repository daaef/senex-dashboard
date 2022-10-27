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
          src="/img/checkmark.svg"
          alt=""
          class="profile__checkmark u-mr-10"
        />
        <p class="text-13">Account Created</p>
      </div>
      <div class="u-flex u-mb-40">
        <img
          src="/img/checkmark.svg"
          alt=""
          class="profile__checkmark u-mr-10"
        />
        <p class="text-13">Account Verified</p>
      </div>
      <div class="u-flex">
        <img
          :src="isApproved ? '/img/checkmark.svg' : '/img/checkmark-grey.svg'"
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
      :value="isDeclined ? 'Re-submit KYC' : 'Complete your KYC'"
      class="u-mt-20"
      :on-submit="
        () => {
          this.showKYCACC = true
        }
      "
    />
    <p v-if="isUnderReview" class="text-14" style="color: #FFCCCC; padding-top: 12px;">
      <em> Your submission is being reviewed </em>
    </p>
    <p v-if="isDeclined" class="text-14" style="color: #FFCCCC; padding-top: 12px;">
      <em> {{ user.profile.statusResultText }} </em>
    </p>

    <vue-final-modal v-model="showModal">
      <div class="kyc--overlay" @click.self="showModal = false">
        <div class="kyc--container flex u-d-flex--col">
          <div class="img--container">
            <img src="/img/success.png" alt="Success Image">
          </div>
          <div class="text--btn--content">
            <h3>Smooth</h3>
            <p>Your KYC verification was submitted</p>
            <button class="b-not-found__btn" @click="showModal = false">
              Done
            </button>
          </div>
        </div>
      </div>
    </vue-final-modal>

    <vue-final-modal v-model="showKYCACC">
      <div class="kyc--overlay" @click.self="showKYCACC = false">
        <div class="kyc--container flex u-d-flex--col">
          <div class="flex kyc--header u-d-flex--justify-center">
            <img
              class="close cursor-pointer"
              src="/img/icons/close_round_modal_icon.svg"
              alt="close"
              @click="showKYCACC = false"
            />
            <h3 class="heading-primary u-text-center u-mx-auto">
              Means of ID
            </h3>
          </div>
          <form class="kyc-radios">
            <div class="form-check">
              <input v-model="smile_id_product" class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" value="doc_verification">
              <label class="form-check-label inline-block" for="flexRadioDefault1">
                  International Passport
              </label>
            </div>
            <div class="form-check">
              <input v-model="smile_id_product" class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" value="biometric_kyc">
              <label class="form-check-label inline-block" for="flexRadioDefault2">
                  Other means of ID
              </label>
            </div>
            <BtnSpinner
              :is-loading="processing"
              value="Continue Verification"
              :on-submit="
              () => {
                this.startSession()
              }
            "
            />
          </form>
        </div>
      </div>
    </vue-final-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  // middleware: 'authenticated',
  data() {
    return {
      processing: false,
      submitted: false,
      showModal: false,
      showKYCACC: false,
      showRegulation: false,
      smile_id_product: 'biometric_kyc',
      smile_id_options: {
        biometric_kyc: {
            'NG': ['NIN', 'NIN_SLIP', 'DRIVERS_LICENSE', 'VOTER_ID'],
            'ZA': ['NATIONAL_ID'],
          },
        doc_verification: {
          'NG': ['PASSPORT'],
          'ZA': ['PASSPORT'],
        }
      },
      smile_id_products: ['enhanced_kyc', 'biometric_kyc', 'doc_verification'],
    }
  },
  computed: {
    ...mapState('auth', ['user']),
    isApproved() {
      return this.user.profile.status == 'Approved'
    },
    idOptions(){
      return this.smile_id_options[this.smile_id_product]
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
        const data = await this.$api.getSmileToken({ product: this.smile_id_product })
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
          id_selection: this.idOptions,
          onSuccess: () => {
            this.$api.notifySubmission()
            this.processing = false
            this.submitted = true
            this.showModal = true
          },
          onClose: () => {
            this.processing = false
          },
          onError: () => {
            this.processing = false
            // button.textContent = 'Verify with Smile Identity'
            // button.disabled = false
          },
        })
      }
    },
  },
}
</script>

<style lang="scss">
  .kyc--overlay {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100%;
    max-width: 100%;
    .kyc--container {
      padding: 50px;
      border-radius: 30px;
      background: #111219;
      box-shadow: 0px 0px 6px #707070;
      border: 1px solid #707070;
      text-align: center;
      max-width: 100%;
      .img--container {
        padding: 20px 20px 0;
        max-width: 100%;
        height: 250px;
        img {
          height: 100%;
          max-width: 100%;
        }
      }
      .text--btn--content {
        margin-top: -50px;
      }
      h3 {
        font-weight: 700;
        font-size: 2.5rem;
        line-height: 1.2em;
        margin-top: 20px;
      }
      p {
        line-height: 1.2em;
        margin: 35px 0;
        font-size: 1.9rem;
      }
      button {
        width: 100%;
      }
      .kyc--header {
        position: relative;
        min-width: 350px;
          .close {
            position: absolute;
            left: -30px;
            top: 0;
            height: 25px;
            width: 25px;
            transform: translateY(5px);
          }
        h3 {
          margin-top: 0;
        }
      }
      .kyc-radios {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin-top: 50px;
        .form-check {
          margin-bottom: 30px;
          position: relative;
          .form-check-label {
            cursor: pointer;
            text-align: left;
            color: #fafafa;
            display: flex;
            align-items: center;
            border-radius: 15px;
            padding: 15px 15px 15px 50px;
            transition: .3s ease-in-out;
          }
          &:hover {
            .form-check-label {
              background: #181D2C;
            }
          }

        .form-check-input {
          position: absolute;
          appearance: none;
          background: transparent;
          width: 25px;
          height: 25px;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          border-radius: 50%;
          border: 3px solid #3382FA;
          transition: .3s ease-in-out;
          &:checked {
            border: 7px solid #3382FA;
            & ~ label {
              background: #181D2C;
            }
          }
        }
      }
      }
    }
  }
</style>
