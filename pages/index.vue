<template>
  <div class="">
    <div class="index-txn-info">
      <transaction-card
        text="Total Transaction"
        :amount="`${selected} ${totalOrderValue}`"
      ></transaction-card>
      <transaction-card
        text="Total Buy"
        :amount="`${selected} ${ngnBuy}`"
      ></transaction-card>
      <transaction-card
        text="Total Sell"
        :amount="`${selected} ${ngnSell}`"
      ></transaction-card>
    </div>
    <div class="u-my-big">
      <transaction-table :orders="orders"></transaction-table>
    </div>
  </div>
</template>

<script>
// import TransactionCard from '~/components/index/TransactionCard.vue'
// import TransactionTable from '~/components/transaction/TransactionTable.vue'
import { mapState } from 'vuex'
export default {
  // components: {
  //   TransactionCard,
  //   TransactionTable,
  // },
  layout: 'dashboard',
  middleware: 'authenticated',
  data() {
    return {
      selected: '₦',
      totalOrderValue: 0,
      ngnBuy: 0,
      ngnSell: 0,
      zarBuy: 0,
      zarSell: 0,
      options: [
        {
          text: 'NGN',
          value: '₦',
        },
        {
          text: 'ZA',
          value: 'R',
        },
      ],
      orders: [],
    }
  },
  beforeMount() {
    this.getDashboard()
    this.fetchOrders()
  },
  computed: {
    ...mapState('auth', ['user']),
  },
  methods: {
    async getDashboard() {
      try {
        const { data } = await this.$api.getDashboard()
        if (data.data) {
          this.ngnBuy = data.data.ngnTotalBuy
          this.ngnSell = data.data.ngnTotalSell
          this.zarBuy = data.data.zarTotalBuy
          this.zarSell = data.data.zarTotalSell
          this.stats[1].total = data.data.totalCompleted
          this.stats[2].total = data.data.totalExpired
          this.totalOrderValue = this.ngnBuy + this.ngnSell
        }
      } catch (error) {
        this.$notify({
          text: 'An error occured when order summary.',
          type: 'error',
        })
      }
    },
    async fetchOrders() {
      try {
        this.processing = true
        const { data } = await this.$api.fetchTrades(1, '')
        this.orders = data.results.sort(
          (a, b) => new Date(b.created) - new Date(a.created)
        )
        this.totalPages = parseInt((data.count - 1) / this.perPage) + 1
        this.processing = false
      } catch (error) {
        this.processing = false
        this.$notify({
          text: 'An error occured when fetching orders',
          type: 'error',
        })
      }
    },
  },
}
</script>
