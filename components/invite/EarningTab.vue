<template>
  <div class="earning">
    <h3 class="heading-secondary fw-400 u-mb-10">Referral Balance</h3>
    <h3 class="heading-primary--md u-white u-mb-10">
      ${{ referralData.rewardBalance }}
    </h3>
    <p class="earning__min-amount-text u-mb-10">
      The minimum amount you can withdraw is ${{ referralData.minWithdrawal }}
    </p>
    <BtnSpinner
      value="Withdraw"
      :is-loading="processing"
      :is-in-active="isBtnDisabled()"
      :on-submit="withdrawReward"
      set-class="btn--px2py1 earning__withdraw-btn"
    />
    <div class="earning__list-box">
      <div class="earning__list-item">
        <span>Total amount earned</span
        ><span>${{ referralData.totalEarned }}</span>
      </div>
      <div class="earning__list-item">
        <span>No. of sign ups</span
        ><span class="u-link">{{ referralData.referralCount }}</span>
      </div>
      <div class="earning__list-item">
        <span>No. of active invited users</span
        ><span class="u-link">{{ referralData.activeReferrals }}</span>
      </div>
      <div class="earning__list-item">
        <span>Next payout date</span><span>{{ getNextPayoutDate() }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
export default {
  props: {
    referralData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      processing: false,
    }
  },
  computed: {
    ...mapState('auth', ['user']),
  },
  methods: {
    getNextPayoutDate() {
      const now = new Date()
      const today = now.getDate()
      const day = parseInt(this.referralData.payoutDay)
      const month = today < day ? now.getMonth() : now.getMonth() + 1
      return moment(new Date(now.getFullYear(), month, day)).format(
        'dddd, DD MMM YYYY'
      )
    },
    isBtnDisabled() {
      const now = new Date()
      const today = now.getDate()
      return (
        this.referralData.rewardBalance < this.referralData.minWithdrawal ||
        this.referralData.payoutDay > today
      )
    },
    async withdrawReward() {
      const { data } = await this.$api.withdrawReward({
        wallet: '',
      })
    },
  },
}
</script>

<style></style>
