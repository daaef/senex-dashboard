<template>
  <div class="tab-holder" v-if="currentTab">
    <div class="tab-list">
      <div class="tab-list__box">
        <div
          v-for="(tab, index) in tabs"
          :key="index"
          class="tab-list__item"
          @click="onSelect(tab, index)"
        >
          {{ tab.title }}
        </div>
        <span
          class="tab-list__glider"
          :class="`tab-list__glider--${currentTabIndex + 1}`"
        ></span>
      </div>
    </div>
    <div class="tab-drop">
      <p class="tab-drop__title-con" @click="toggleOpen">
        <span class="title">{{ currentTab.title }}</span>
        <span class="arrow-con" :class="[dropOpen ? 'rotate-up' : '']"
        ><img src="/img/awesome-arrow-down-white.svg" alt="down arrow"
        /></span>
      </p>
      <div class="tab-drop__content" :class="[dropOpen ? '' : 'u-none']">
        <p
          class="tab-drop__item"
          v-for="(tab, idx) in tabs"
          :key="idx"
          @click="
            () => {
              onSelect(tab, idx)
              dropOpen = false
            }
          "
        >
          {{ tab.title }}
        </p>
      </div>
    </div>
    <div>
      <nuxt-child :referralData="currentTab.properties.referralData" :getReferrals="currentTab.properties.getReferrals" />
    </div>
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
