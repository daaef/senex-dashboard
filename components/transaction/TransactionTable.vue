<template>
  <div class="txn-table">
    <div class="txn-table__header">
      <h3 class="heading-tertiary">Recent Transactions</h3>
      <span class="u-link">View all</span>
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
          <tr v-for="idx in 10" :key="idx">
            <td class="">Date</td>
            <td class="">Order ID</td>
            <td class="">Order Type</td>
            <td class="">Crypto Value</td>
            <td class="">Fiat Value</td>
            <td class="status">
              <span class="status-icon"></span>Pending
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style></style>
