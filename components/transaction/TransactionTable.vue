<template>
  <div class="txn-table">
    <div v-if="showHeader" class="txn-table__header">
      <h3 class="heading-tertiary">Recent Transactions</h3>
      <router-link to="/transactions" class="u-link">View all</router-link>
    </div>
    <div class="txn-table__wrapper">
      <table class="txn-table__main">
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
            <td class="">{{ row.fiatCurrency }} {{ row.fiatAmount }}</td>
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
    </div>
  </div>
</template>

<script>
import moment from 'moment'
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
  methods: {
    formatDate(thisDate) {
      return moment(new Date(thisDate)).format('lll')
    },
  },
}
</script>

<style></style>
