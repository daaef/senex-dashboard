<template>
  <div class="txn-tab">
    <div class="txn-tab__header u-my-30">
      <div class="txn-tab__search-box">
        <img
          src="/img/search-grey.svg"
          alt="search"
          class="txn-tab__search-icon"
        />
        <input
          v-model="search"
          type="text"
          class="txn-tab__search-input"
          placeholder="Search"
        />
      </div>
      <div class="txn-tab__page-box">
        <span
          >{{ currentPage * perPage - perPage + 1 }}-{{
            perPage * currentPage
          }}
          of {{ totalPages * perPage }}</span
        >
        <div class="txn-tab__arrow-box">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="11.115"
            height="18"
            viewBox="0 0 11.115 18"
            class="icon"
            @click="changeCurrentPage(currentPage - 1)"
          >
            <path
              id="Icon_material-navigate-next"
              data-name="Icon material-navigate-next"
              d="M21.885,9,24,11.115,17.13,18,24,24.885,21.885,27l-9-9Z"
              transform="translate(-12.885 -9)"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="11.115"
            height="18"
            viewBox="0 0 11.115 18"
            class="icon"
            @click="changeCurrentPage(currentPage + 1)"
          >
            <path
              id="Icon_material-navigate-next"
              data-name="Icon material-navigate-next"
              d="M15,9l-2.115,2.115L19.755,18l-6.87,6.885L15,27l9-9Z"
              transform="translate(-12.885 -9)"
            />
          </svg>
        </div>
      </div>
    </div>
    <transaction-table
      :show-header="showHeader"
      :orders="filteredOrders()"
    ></transaction-table>
  </div>
</template>

<script>
import { mapState } from 'vuex'
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
      search: '',
    }
  },
  watch: {
    selectedFiatCurrency(value) {
      this.fetchOrders({
        page: this.currentPage,
        status: this.status,
        fiat: value,
      })
    },
  },
  mounted() {
    const payload = {
      page: this.currentPage,
      fiat: this.selectedFiatCurrency,
    }
    if (this.status) {
      payload.status = this.status
    }
    this.fetchOrders(payload)
  },
  computed: {
    ...mapState({
      selectedFiatCurrency: (state) => state.selectedFiatCurrency.ticker,
    }),
  },
  methods: {
    changeCurrentPage(page) {
      if (page < 1 || page > this.totalPages) {
        return
      }
      this.currentPage = page
      const params = {
        page: this.currentPage,
        status: this.status,
        fiat: this.selectedFiatCurrency,
      }
      this.fetchOrders(params)
    },
    async fetchOrders(params) {
      try {
        this.processing = true
        const { data } = await this.$api.fetchTrades(params)
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
    filteredOrders() {
      if (!this.search) {
        return this.orders
      }
      const search = this.search.toLowerCase()
      return this.orders.filter((order) => {
        return order.id.toLowerCase().includes(search)
      })
    },
  },
}
</script>

<style></style>
