<template>
  <div class="u-d-flex u-d-flex--col u-flex-1">
    <template v-if="order.orderType == 'sell'">
      <AddNewBankAccount @getOrderData="getOrderData" />
    </template>
    <template v-else>
      <AddNewWallet @getOrderData="getOrderData" />
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {

  computed: {
    ...mapState({
      order: state => state.order.orderDetail
    })
  },
  methods: {
    getOrderData(data) {
      this.$emit('getOrderData', data)
    }
  }
}
</script>

<style>

</style>