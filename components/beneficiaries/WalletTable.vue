<template>
  <div class="txn-table">
    <div v-if="showHeader" class="txn-table__header">
      <h3 class="heading-tertiary">Recent Transactions</h3>
      <span class="u-link">View all</span>
    </div>
    <div class="txn-table__wrapper">
      <table class="txn-table__main">
        <thead class="txn-table__head">
          <tr>
            <th class="th th--20">Cryptcurrency</th>
            <th class="th th--20">Nickname</th>
            <th class="th th--20">Wallet address</th>
            <th class="th th--20">Fiat Value</th>
            <th class="th th--20">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="idx in 10" :key="idx">
            <td class="td td--20">Bitcoin</td>
            <td class="td td--20">Ahmed</td>
            <td class="td td--20">18QJXrJvfberRz8HSM…</td>
            <td class="td td--20 status status--blue">
              <span class="status-dot"></span>Edit
            </td>
            <td class="td td--20 status status--red"><span class="status-dot"></span>Delete</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showHeader: {
      type: Boolean,
      default: true,
    },
  },
}
</script>

<style></style>
