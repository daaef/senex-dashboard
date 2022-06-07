<template>
  <div class="invite">
    <div class="invite__top-content u-mb-40">
      <div class="invite__header u-mb-20 u-white">
        <h3 class="heading-primary--big">
          Invite a friend to SenexPay and you’ll both get 10 USDT.
        </h3>
      </div>
      <p class="u-mb-20">
        Know someone curious about crypto? You’ll both receive NGN 4,158.16 in
        Bitcoin when they buy or sell NGN 41,581.65 or more on Coinbase!
        <router-link class="u-link" to="/">Learn more</router-link>.
      </p>
      <div class="invite__email-form">
        <div class="invite__email-box">
          <EmailInputList
            :list="list"
            @removeEmail="removeEmail"
            @addEmail="addEmail"
          />
          <p class="invite__separate-email">Separate email with commas</p>
        </div>
        <div class="invite__send-invites">
          <BtnSpinner
            value="Send Invites"
            :is-loading="processing"
            :is-in-active="list.length === 0"
            :on-submit="inviteFriends"
            set-class="btn btn--px2py1 u-mb-10"
          />
          <!-- <button class="btn btn--px2py1 u-mb-10">Send Invites</button> -->
          <!-- <p class="u-link">Preview email</p> -->
        </div>
      </div>
    </div>
    <span class="invite__line u-mb-40"></span>
    <div class="invite__bottom-content">
      <div class="invite__link-and-social-box u-mb-20">
        <div class="invite__link-box">
          <h3 class="heading-primary fw-400 u-mb-10">Your invite code</h3>
          <div class="invite__link-input-box">
            <span>{{ user.referralId }}</span>
            <span
              class="extra"
              @click="toggleCopyCode"
              v-clipboard="user.referralId"
              >{{ copyCode }}</span
            >
          </div>
        </div>
      </div>
      <div class="invite__link-and-social-box u-mb-40">
        <div class="invite__link-box">
          <h3 class="heading-primary fw-400 u-mb-10">Your invite link</h3>
          <div class="invite__link-input-box">
            <span>{{ getReferralLink() }}</span>
            <span
              class="extra"
              @click="toggleCopyLink"
              v-clipboard="() => getReferralLink()"
              >{{ copyLink }}</span
            >
          </div>
        </div>
        <div class="invite__social-box">
          <h3 class="heading-primary fw-400 u-mb-10">Share via social</h3>
          <div class="invite__social-img-box">
            <a
              href="https://www.instagram.com/senexpay/"
              target="_blank"
              rel="noopener"
              ><img src="/img/white-instagram.svg" alt="instagram"
            /></a>
            <a
              href="https://web.facebook.com/senexpay/"
              target="_blank"
              rel="noopener"
              ><img src="/img/white-facebook.svg" alt="facebook"
            /></a>
            <a
              href="https://twitter.com/senexng/"
              target="_blank"
              rel="noopener"
              ><img src="/img/white-twitter.svg" alt="twitter"
            /></a>
            <a
              href="https://linkedin.com/company/senexpay/"
              target="_blank"
              rel="noopener"
              ><img src="/img/white-linkedin.svg" alt="linkedin"
            /></a>
          </div>
        </div>
      </div>
      <div v-if="referralData.inviteeList.length > 0" class="invite__pending">
        <h3 class="fw-700 u-mb-20">
          Pending Invitations ({{ referralData.inviteeList.length }})
        </h3>
        <div
          v-for="(item, idx) in referralData.inviteeList"
          class="invite__pending__item"
          :key="idx"
        >
          <span>{{ item }}</span>
          <div class="invite__pending__action-box">
            <span class="invite__pending__delete u-mr-10">Delete</span>
            <span
              class="invite__pending__resend"
              @click="() => resendInvitation(item)"
              >Resend</span
            >
          </div>
        </div>
        <span class="invite__pending__arrow"></span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    referralData: {
      type: Object,
      default: () => ({
        inviteeList: [],
      }),
    },
  },
  data() {
    return {
      landingURL: '',
      list: [],
      processing: false,
      copyCode: 'Copy code',
      copyLink: 'Copy link',
    }
  },
  mounted() {
    this.landingURL = process.env.SENEX_LANDING_SITE_URL
  },
  computed: {
    ...mapState('auth', ['user']),
  },
  methods: {
    toggleCopyCode() {
      this.copyCode = 'Copied'
      const vm = this
      setTimeout(() => {
        vm.copyCode = 'Copy code'
      }, 500)
    },
    toggleCopyLink() {
      this.copyLink = 'Copied'
      const vm = this
      setTimeout(() => {
        vm.copyLink = 'Copy link'
      }, 500)
    },
    getReferralLink() {
      return `${this.landingURL}?ref=${this.user.referralId}`
    },
    removeEmail(index) {
      this.list.splice(index, 1)
    },
    addEmail(email) {
      this.list.push(email)
    },
    async inviteFriends() {
      this.processing = true
      const { data } = this.$api.inviteFriends({
        emailList: this.list.join(','),
      })
      try {
        this.$notify({
          type: 'success',
          text: data.message,
        })
      } catch (e) {
        console.log(e)
      } finally {
        this.processing = false
      }
    },
    async resendInvitation(email) {
      const { data } = this.$api.inviteFriends({
        emailList: email,
      })
      try {
        this.$notify({
          type: 'success',
          text: data.message,
        })
      } catch (e) {
        console.log(e)
      }
    },
  },
}
</script>

<style></style>
