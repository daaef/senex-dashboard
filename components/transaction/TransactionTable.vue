<template>
  <div class="txn-table">
    <div v-if="showHeader" class="txn-table__header">
      <h3 class="heading-tertiary">Recent Transactions</h3>
      <router-link to="/transactions" class="u-link">View all</router-link>
    </div>
    <div class="txn-table__wrapper">
      <table class="txn-table__main txn-table__main--hide-mobile">
        <thead class="txn-table__head">
          <tr>
            <th class="">Date</th>
            <th class="">Order ID</th>
            <th class="">Order Type</th>
            <th class="">Crypto Value</th>
            <th class="">Fiat Value</th>
            <th class="">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, idx) in orders" :key="idx">
            <td class="">{{ formatDate(row.created) }}</td>
            <td class="">{{ row.id }}</td>
            <td class="">{{ row.type }}</td>
            <td class="">{{ row.cryptoAmount }} {{ row.cryptoCurrency }}</td>
            <td class="">
              {{ row.fiatAmount | formatMoney(row.fiatCurrency) }}
            </td>
            <td
              class="status"
              :class="[
                row.status == 'expired'
                  ? 'status--red'
                  : row.status === 'completed'
                  ? 'status--green'
                  : '',
              ]"
            >
              <span class="status-dot"></span
              >{{ row.status == 'paid' ? 'Pending' : row.status }}
            </td>
          </tr>
        </tbody>
      </table>
      <div class="txn-table-mobile">
        <div
          v-for="(item, idx) in orders"
          :key="idx"
          class="txn-table-mobile__item"
        >
          <div class="txn-table-mobile__content">
            <p>{{ formatDate(item.created) }}</p>
            <p class="small-text">{{ item.id }}</p>
          </div>
          <div class="txn-table-mobile__content">
            <p>{{ item.cryptoAmount }} {{ item.cryptoCurrency }}</p>
            <p class="small-text">
              {{ item.fiatAmount | formatMoney(item.fiatCurrency) }}
            </p>
          </div>
          <div class="txn-table-mobile__content txn-table-mobile__content--sm">
            <p class="u-capitalize">{{ item.type }}</p>
            <p
              class="status small-text"
              :class="[
                item.status == 'expired'
                  ? 'status--red'
                  : item.status === 'completed'
                  ? 'status--green'
                  : '',
              ]"
            >
              {{ item.status == 'paid' ? 'Pending' : item.status }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import formatMoney from '~/filters/format-money'
export default {
  props: {
    showHeader: {
      type: Boolean,
      default: true,
    },
    orders: {
      type: Array,
      default: () => [],
    },
  },
  filters: { formatMoney },
  methods: {
    formatDate(thisDate) {
      return moment(new Date(thisDate)).format('MMM DD, YYYY')
    },
  },
}
</script>

<style></style>
