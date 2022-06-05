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
    <div class="index-marquee u-mb-20">
      <div class="index-rate-box">
        <div class="rate">
          <p class="u-mr-10">1 BTC = 23,079,836</p>
          <img
            :src="`img/icons/${
              true ? 'green_triangle_up' : 'red_triangle_down'
            }.svg`"
            alt="arrow"
            class="u-mr-10"
          />
          <p>-2.08%</p>
        </div>
        <div class="rate">
          <p class="u-mr-10">1 BTC = 23,079,836</p>
          <img
            :src="`img/icons/${
              false ? 'green_triangle_up' : 'red_triangle_down'
            }.svg`"
            alt="arrow"
            class="u-mr-10"
          />
          <p>-2.08%</p>
        </div>
        <div class="rate">
          <p class="u-mr-10">1 BTC = 23,079,836</p>
          <img
            :src="`img/icons/${
              true ? 'green_triangle_up' : 'red_triangle_down'
            }.svg`"
            alt="arrow"
            class="u-mr-10"
          />
          <p>-2.08%</p>
        </div>
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
        <div class="u-flex u-flex--space-between u-flex--align-center u-mb-30">
          <h3 class="heading-secondary">Recent Transactions</h3>
          <router-link to="/transactions" class="u-link">See all</router-link>
        </div>
        <template v-if="orders.length > 0">
          <div class="index-recent-txn__rct-box">
            <div
              v-for="(order, idx) in orders"
              :key="idx"
              class="index-recent-txn__item"
            >
              <img
                :src="`img/crypto/${order.cryptoCurrency.toLowerCase()}.svg`"
                alt="coin"
              />
              <div class="coin-date">
                <h4 class="fw-500 heading-tertiary">
                  {{ order.cryptoCurrency }}
                </h4>
                <p class="small-text">{{ formatDate(order.created) }}</p>
              </div>
              <h4 class="amount fw-700">
                {{ order.fiatAmount | formatMoney(order.fiatCurrency) }}
              </h4>
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
        <div class="index-earn">
          <div class="index-earn__top">
            <div class="index-earn__content">
              <img src="img/icons/icon_metro_trophy.svg" alt="cup" />
              <span class="small-text">Comrade</span>
            </div>
            <div class="index-earn__content index-earn__content--1">
              <span class="small-text">You have earned</span>
              <h3 class="heading-primary">N1,759,090</h3>
            </div>
            <div class="index-earn__content">
              <img
                src="img/icons/icon_awesome_users.svg"
                class="users"
                alt="cup"
              />
              <span class="fw-700">45</span>
            </div>
          </div>
          <BtnSpinner
            :is-in-active="false"
            :is-loading="false"
            value="Invite more friends"
            setClass="index-earn__btn"
            :on-submit="
              () => {
                $router.push('/invite')
              }
            "
          />
        </div>
        <div class="index-ex">
          <h3 class="heading-secondary index-ex__heading u-mb-20">Exchange</h3>
          <div class="index-ex__rate-and-btn">
            <div class="index-ex__rate-box">
              <div class="index-ex__rate-item">
                <div class="coin">
                  <img src="img/crypto/btc.svg" alt="coin" class="u-mr-5" />
                  <span>Bitcoin</span>
                </div>
                <div class="rate">
                  <span>23,079,836</span>
                  <img
                    :src="`img/icons/${
                      true ? 'green_triangle_up' : 'red_triangle_down'
                    }.svg`"
                    alt="coin"
                  />
                  <span>-2.08%</span>
                </div>
              </div>
              <div class="index-ex__rate-item">
                <div class="coin">
                  <img src="img/crypto/usdt.svg" alt="coin" class="u-mr-5" />
                  <span>Bitcoin</span>
                </div>
                <div class="rate">
                  <span>23,079,836</span>
                  <img
                    :src="`img/icons/${
                      true ? 'green_triangle_up' : 'red_triangle_down'
                    }.svg`"
                    alt="coin"
                  />
                  <span>-2.08%</span>
                </div>
              </div>
            </div>
            <BtnSpinner
              :is-in-active="false"
              :is-loading="false"
              value="Buy/Sell"
              setClass="index-ex__btn"
              :on-submit="
                () => {
                  $router.push('/transactions')
                }
              "
            />
          </div>
        </div>
      </div>
    </div>
    <div class="index-guide u-mb-30">
      <img src="img/icons/info_yellow_round_icon.svg" alt="lady" />
      <div class="index-guide__content">
        <h3 class="heading-primary--md">
          <span class="u-block u-line-height-1">New to Crypto?</span>
          <span class="u-block">Let’s guide you.</span>
        </h3>
        <p class="small-text">
          Join our Crypto Advisor programme and get expert advice.
        </p>
      </div>
      <BtnSpinner
        :is-in-active="false"
        :is-loading="false"
        value="Book a session"
        setClass="index-guide__btn"
      />
    </div>
  </div>
</template>

<script>
// import TransactionCard from '~/components/index/TransactionCard.vue'
// import TransactionTable from '~/components/transaction/TransactionTable.vue'
import { mapState } from 'vuex'
import formatMoney from '~/filters/format-money'
import moment from 'moment'
export default {
  // components: {
  //   TransactionCard,
  //   TransactionTable,
  // },
  layout: 'dashboard',
  middleware: 'authenticated',
  filters: {
    formatMoney,
  },
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
      return moment(new Date(thisDate)).format('lll')
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
        this.orders = data.results
          .sort((a, b) => new Date(b.created) - new Date(a.created))
          .splice(0, 5)
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
