<template>
  <div class="container">
    <div class="index-txn-info">
      <transaction-card
        text="Total Transaction"
        amount="N898,000,000"
      ></transaction-card>
      <transaction-card text="Total Buy" amount="N1,759,090"></transaction-card>
      <transaction-card text="Total Sell" amount="N800,000"></transaction-card>
    </div>
  </div>
</template>

<script>
import TransactionCard from '~/components/index/TransactionCard.vue'
export default {
  components: {
    TransactionCard,
  },
  layout: 'dashboard',
}
</script>
