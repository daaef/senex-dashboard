<template>
  <div>
    <tab-holder :tabs="tabs"></tab-holder>
  </div>
</template>

<script>
export default {
  layout: 'dashboard',
  data() {
    return {
      tabs: [
        {
          title: 'Wallets',
          component: 'BenefTab',
          properties: {
            showHeader: false,
            btnText: 'Add Wallet',
          },
        },
        {
          title: 'Bank Accounts',
          component: 'BenefTab',
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
