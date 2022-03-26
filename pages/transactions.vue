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
          title: 'All Transactions',
          component: 'TxnTab',
          properties: {
            showHeader: false,
          },
        },
        {
          title: 'Completed Transactions',
          component: 'TxnTab',
        },
        {
          title: 'Pending Transactions',
          component: 'TxnTab',
        },
        {
          title: 'Expired Transactions',
          component: 'TxnTab',
        },
      ],
    }
  },
}
</script>

<style></style>
