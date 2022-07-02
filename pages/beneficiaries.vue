<template>
  <div>
    <tab-holder :tabs="tabs"></tab-holder>
  </div>
</template>

<script>
export default {
  layout: 'dashboard',
  middleware: 'authenticated',
  head() {
    return {
      title: 'Beneficiaries | SenexPay ',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'SenexPay beneficiaries',
        },
      ],
    }
  },
  data() {
    return {
      tabs: [
        {
          title: 'Wallets',
          component: 'WalletTab',
          properties: {
            showHeader: false,
            btnText: 'Add Wallet',
          },
        },
        {
          title: 'Bank Accounts',
          component: 'BankAccTab',
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
