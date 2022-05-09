<template>
  <div class="earning">
    <h3 class="heading-secondary fw-400 u-mb-10">Referral Balance</h3>
    <h3 class="heading-primary--md u-white u-mb-10">${{ rewardBalance }}</h3>
    <p class="earning__min-amount-text u-mb-10">
      The minimum amount you can withdraw is ${{ minWithdrawal }}
    </p>
    <button class="btn btn--px2py1 earning__withdraw-btn">Withdraw</button>
    <div class="earning__list-box">
      <div class="earning__list-item">
        <span>Total amount earned</span><span>${{ totalEarned }}</span>
      </div>
      <div class="earning__list-item">
        <span>No. of sign ups</span
        ><span class="u-link">{{ inviteeCount }}</span>
      </div>
      <div class="earning__list-item">
        <span>No. of active invited users</span
        ><span class="u-link">{{ referralCount }}</span>
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
  beforeMount() {
    this.getReferrals()
  },
  data() {
    return {
      inviteeCount: 0,
      inviteeList: [],
      referralCount: 0,
      referred: [],
      rewardBalance: 0,
      totalEarned: 0,
      minWithdrawal: 8,
      payoutDay: 25,
    }
  },
  computed: {
    ...mapState('auth', ['user']),
  },
  methods: {
    async getReferrals() {
      const { data } = await this.$api.getReferrals()
      this.inviteeCount = data.inviteeCount
      this.inviteeList = data.inviteeList
      this.referralCount = data.referralCount
      this.referred = data.referred
      this.rewardBalance = data.rewardBalance
      this.totalEarned = data.totalEarned
      this.payoutDay = data.payoutDay
    },
    getNextPayoutDate() {
      const now = new Date()
      const today = now.getDate()
      const day = parseInt(this.payoutDay)
      const month = today < day ? now.getMonth() : now.getMonth() + 1
      return moment(new Date(now.getFullYear(), month, day)).format(
        'dddd, DD MMM YYYY'
      )
    },
  },
}
</script>

<style></style>
