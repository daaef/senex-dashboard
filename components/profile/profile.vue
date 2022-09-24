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
          component: 'ProfileTab',
          properties: {
            showHeader: false,
            btnText: 'Add Wallet',
          },
        },
        {
          title: 'Next Of Kin',
          component: 'NextOfKinTab',
          properties: {
            showHeader: false,
            btnText: 'Add Bank Account',
          },
        },
        {
          title: 'KYC Verification',
          component: 'KYCVerificationTab',
          properties: {
            showHeader: false,
            btnText: 'Add Bank Account',
          },
        },
      ],
    }
  },
}
</script>

<style></style>
