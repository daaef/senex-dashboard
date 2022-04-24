<template>
  <div class="txn-table">
    <div class="txn-table__wrapper">
      <table class="txn-table__main">
        <thead class="txn-table__head">
          <tr>
            <th class="th th--20">Cryptcurrency</th>
            <th class="th th--20">Nickname</th>
            <th class="th th--40">Wallet address</th>
            <th class="th th--10"></th>
            <th class="th th--10"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(wallet, idx) in wallets" :key="idx">
            <td class="td td--20">{{ wallet.currency }}</td>
            <td class="td td--20">{{ wallet.label }}</td>
            <td class="td td--40">{{ wallet.walletAddress }}</td>
            <td class="td td--10 status status--blue">
              <span
                class="u-pointer"
                @click="$emit('editOrDelete', 'edit', wallet.id)"
                ><img src="img/icons/edit_icon.svg" alt="edit" /> Edit</span
              >
            </td>
            <td class="td td--10 status status--red">
              <span class="u-pointer" @click="$emit('editOrDelete', 'delete', wallet.id)"
                ><img
                  src="img/icons/delete_icon.svg"
                  alt="delete"
                />Delete</span
              >
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
    wallets: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<style></style>
