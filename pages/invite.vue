<template>
  <div>
    <tab-holder :tabs="tabs"></tab-holder>
  </div>
</template>

<script>
export default {
  layout: 'dashboard',
  // middleware: 'authenticated',
  head() {
    return {
      title: 'Invite | SenexPay ',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'SenexPay Dashboard'
        }
      ]
    }
  },
  beforeMount() {
    this.getReferrals()
  },
  data() {
    return {
      tabs: [
        {
          title: 'Invite A Friend',
          component: 'InviteFriendTab',
          url: '/',
          properties: {
            referralData: this.referralData,
            getReferrals: this.getReferrals,
          },
        },
        {
          title: 'Earnings',
          component: 'EarningTab',
          url: '/earnings',
          properties: {
            referralData: this.referralData,
            getReferrals: this.getReferrals,
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
      dropOpen: false,
    }
  },
  computed: {
    currentTab(){
      return this?.tabs?.find(tab => {
          return `/invite${tab.url}` === this?.$route.path
        }) ||
      {
        title: 'Invite A Friend',
        component: 'InviteFriendTab',
        properties: {
          referralData: this.referralData,
          getReferrals: this.getReferrals,
        },
      }
    },
    currentTabIndex(){
      return this?.tabs?.indexOf(this?.currentTab)
    }
  },
  methods: {
    toggleOpen() {
      this.dropOpen = !this.dropOpen
    },
    onSelect(tab, index) {
      // const isSameTabName = this.currentTab.component === tab.component
      this.$router.push(`/invite${tab.url}`)
    },
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
