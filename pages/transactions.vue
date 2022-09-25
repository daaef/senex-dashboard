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
      title: 'Transactions | SenexPay ',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Start a transaction today',
        },
      ],
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
          title: 'Completed',
          component: 'TxnTab',
          properties: {
            showHeader: false,
            tag: 'completed',
            status: 'completed',
          },
        },
        {
          title: 'Pending',
          component: 'TxnTab',
          properties: {
            showHeader: false,
            tag: 'pending',
            status: 'pending',
          },
        },
        {
          title: 'Paid',
          component: 'TxnTab',
          properties: {
            showHeader: false,
            tag: 'paid',
            status: 'paid',
          },
        },
        {
          title: 'Expired',
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
