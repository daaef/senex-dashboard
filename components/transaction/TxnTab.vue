<template>
  <div class="txn-tab">
    <div class="txn-tab__header u-my-30">
      <div class="txn-tab__search-box">
        <img src="h.png" alt="" class="txn-tab__search-icon" />
        <input type="text" class="txn-tab__search-input" placeholder="Search" />
      </div>
      <div class="txn-tab__page-box">
        <span>{{ currentPage }}-{{ perPage }} of {{ totalPages }}</span>
        <div class="txn-tab__arrow-box"></div>
      </div>
    </div>
    <transaction-table
      :show-header="showHeader"
      :orders="orders"
    ></transaction-table>
  </div>
</template>

<script>
export default {
  props: {
    showHeader: {
      type: Boolean,
      default: true,
    },
    tag: {
      type: String,
      default: 'div',
    },
    status: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      currentPage: 1,
      perPage: 10,
      totalPages: 1,
      processing: false,
      orders: [],
    }
  },
  mounted() {
    this.fetchOrders(this.currentPage, this.status)
  },
  methods: {
    changeCurrentPage(page) {
      this.currentPage = page
      this.fetchOrders(this.currentPage, this.status)
    },
    async fetchOrders(page, status) {
      try {
        this.processing = true
        const { data } = await this.$api.fetchTrades(page, status)
        // this.order =
        this.orders = data.results.sort(
          (a, b) => new Date(b.created) - new Date(a.created)
        )

        this.totalPages = parseInt((data.count - 1) / this.perPage) + 1
        // const sortedResult = this.order.results.slice(0, this.perPage)
        // this.filteredOrders = this.order.results.length ? sortedResult : []
        this.processing = false
        // this.loading = false
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

<style></style>
