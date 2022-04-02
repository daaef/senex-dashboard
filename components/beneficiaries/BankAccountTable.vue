<template>
  <div class="txn-table">
    <div class="txn-table__wrapper">
      <table class="txn-table__main">
        <thead class="txn-table__head">
          <tr>
            <th class="th th--20">Currency</th>
            <th class="th th--20">Bank Name</th>
            <th class="th th--20">Account Number</th>
            <th class="th th--20">Fiat Value</th>
            <th class="th th--20">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(bank, idx) in bankAccounts" :key="idx">
            <td class="td td--20">{{ bank.currency }}</td>
            <td class="td td--20">{{ bank.bankName }}</td>
            <td class="td td--20">{{ bank.accountNumber }}</td>
            <td class="td td--20 status status--blue">
              <span class="status-dot"></span>Edit
            </td>
            <td class="td td--20 status status--red">
              <span class="status-dot"></span>Delete
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    bankAccounts: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<style></style>
