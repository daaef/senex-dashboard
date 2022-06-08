<template>
  <div>
    <tab-holder :tabs="tabs"></tab-holder>
  </div>
</template>

<script>
export default {
  layout: 'dashboard',
  middleware: 'authenticated',
  beforeMount() {
    this.getReferrals()
  },
  data() {
    return {
      tabs: [
        {
          title: 'Invite A Friend',
          component: 'InviteFriendTab',
          properties: {
            referralData: this.referralData,
          },
        },
        {
          title: 'Earnings',
          component: 'EarningTab',
          properties: {
            referralData: this.referralData,
          },
        },
      ],
      referralData: {
        inviteeCount: 0,
        activeReferrals: 0,
        inviteeList: [],
        referralCount: 0,
        referred: [],
        minWithdrawal: 0,
        rewardBalance: 12,
        totalEarned: 12,
        payoutDay: 28,
      },
    }
  },
  methods: {
    async getReferrals() {
      const { data } = await this.$api.getReferrals()
      try {
        this.referralData = data
        this.tabs.forEach((tab) => {
          tab.properties.referralData = this.referralData
        })
      } catch (e) {
        console.log(e)
      }
    },
  },
}
</script>

<style></style>
