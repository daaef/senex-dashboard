<template>
  <div class="">
    <div class="index-complete-kyc u-mb-20">
      <div class="index-complete-kyc__info u-mr-10">
        <img
          src="img/icons/green_round_checkmark.svg"
          alt="checkmark"
          class="u-mr-10"
        />
        <p>Complete your KYC to enjoy more features on SenexPay</p>
      </div>
      <div
        class="index-complete-kyc__link-box u-pointer"
        @click="$router.push('/profile')"
      >
        <p class="u-link u-mr-10">Complete your KYC</p>
        <svg
          class="icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 11.115 18"
        >
          <path
            id="Icon_material-navigate-next"
            data-name="Icon material-navigate-next"
            d="M15,9l-2.115,2.115L19.755,18l-6.87,6.885L15,27l9-9Z"
            transform="translate(-12.885 -9)"
            fill="#ffffff"
          />
        </svg>
      </div>
    </div>
    <div class="index-rate-box u-mb-20">
      <div class="rate">
        <p class="u-mr-10">1 BTC = 23,079,836</p>
        <img src="img/icons/delete_icon.svg" alt="arrow" class="u-mr-10" />
        <p>-2.08%</p>
      </div>
      <div class="rate">
        <p class="u-mr-10">1 BTC = 23,079,836</p>
        <img src="img/icons/delete_icon.svg" alt="arrow" class="u-mr-10" />
        <p>-2.08%</p>
      </div>
      <div class="rate">
        <p class="u-mr-10">1 BTC = 23,079,836</p>
        <img src="img/icons/delete_icon.svg" alt="arrow" class="u-mr-10" />
        <p>-2.08%</p>
      </div>
    </div>
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
    <div class="index-txn-earn-ex u-my-big">
      <div class="index-recent-txn">
        <h3 class="heading-secondary u-mb-30">Recent Transactions</h3>
        <template v-if="orders.length > 0">
          <div class="index-recent-txn__rct-box">
            <div
              v-for="(order, idx) in orders"
              :key="idx"
              class="index-recent-txn__item"
            >
              <img src="img/icons/help_icon.svg" alt="coin" />
              <div class="coin-date">
                <h4 class="fw-500">{{ order.cryptoCurrency }}</h4>
                <p class="small-text">{{ formatDate(order.created) }}</p>
              </div>
              <h4 class="heading-tertiary">{{ order.fiatCurrency }} {{ order.fiatAmount }}</h4>
            </div>
          </div>
        </template>
        <template v-else>
          <EmptyState
            heading="No Recent Transaction"
            content="When you make your first transaction, the details will show up here."
            btnText="Buy/Sell"
          />
        </template>
      </div>
      <div class="index-earn-ex">
        <div class="index-earn"></div>
        <div class="index-ex"></div>
      </div>
    </div>
    <!-- <div class="u-my-big">
      <transaction-table :orders="orders"></transaction-table>
    </div> -->
  </div>
</template>

<script>
// import TransactionCard from '~/components/index/TransactionCard.vue'
// import TransactionTable from '~/components/transaction/TransactionTable.vue'
import { mapState } from 'vuex'
import moment from 'moment'
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
    formatDate(thisDate) {
      return moment(new Date(thisDate)).format('MMM DD, YYYY')
    },
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
        ).splice(0, 5)
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
