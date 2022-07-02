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
      title: 'Transactions | SenexPay ',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Start a transaction today'
        }
      ]
    }
  },
  data() {
    return {
      tabs: [
        {
          title: 'All Transactions',
          component: 'TxnTab',
          properties: {
            showHeader: false,
            tag: 'all',
            status: '',
          },
        },
        {
          title: 'Completed Transactions',
          component: 'TxnTab',
          properties: {
            showHeader: false,
            tag: 'completed',
            status: 'completed',
          },
        },
        {
          title: 'Pending Transactions',
          component: 'TxnTab',
          properties: {
            showHeader: false,
            tag: 'pending',
            status: 'pending',
          },
        },
        {
          title: 'Expired Transactions',
          component: 'TxnTab',
          properties: {
            showHeader: false,
            tag: 'expired',
            status: 'expired',
          },
        },
      ],
    }
  },
}
</script>

<style></style>
