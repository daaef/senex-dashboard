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
        <nuxt-child />
      </div>
    </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  layout: 'dashboard',
  middleware: 'authenticated',
  head() {
    return {
      title: 'Profile | SenexPay ',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Profile',
        },
      ],
      script: [],
    }
  },
  data() {
    return {
      tabs: [
        {
          title: 'Profile',
          url: '/',
          component: 'ProfileTab',
          properties: {
            showHeader: false,
            btnText: 'Add Wallet',
          },
        },
        {
          title: 'Next Of Kin',
          url: '/next-of-kin',
          component: 'NextOfKinTab',
          properties: {
            showHeader: false,
            btnText: 'Add Bank Account',
          },
        },
        {
          title: 'KYC Verification',
          url: '/kyc-verification',
          component: 'KYCVerificationTab',
          properties: {
            showHeader: false,
            btnText: 'Add Bank Account',
          },
        },
      ],
      dropOpen: false,
    }
  },
  computed: {
    currentTab(){
      return this?.tabs?.find(tab => {
        return `/profile${tab.url}` === this?.$route.path
      }) ||
      {
        title: 'Profile',
        url: '/',
        component: 'ProfileTab',
        properties: {
          showHeader: false,
          btnText: 'Add Wallet',
        },
      }
    },
    currentTabIndex(){
      return this?.tabs?.indexOf(this?.currentTab)
    }
  },
  methods: {
    onSelect(tab, index) {
      // const isSameTabName = this.currentTab.component === tab.component
      this.currentTab = tab
      this.currentTabIndex = index
      this.$router.push(`/profile${tab.url}`)
    },
    currentTabIdx() {
      return this.tabs.findIndex((tab) => tab.title === this.currentTab.title)
    },
    toggleOpen() {
      this.dropOpen = !this.dropOpen
    },
  },
}
</script>

<style scoped>

</style>
