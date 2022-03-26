<template>
  <div class="txn-tab">
    <div class="txn-tab__header u-my-30">
      <div class="txn-tab__search-box">
        <img src="h.png" alt="" class="txn-tab__search-icon" />
        <input type="text" class="txn-tab__search-input" placeholder="Search" />
      </div>
      <div class="txn-tab__page-box">
        <button class="btn u-mr-20">{{ btnText }}</button>
        <span>1-16 of 16</span>
        <div class="txn-tab__arrow-box"></div>
      </div>
    </div>
    <beneficiary-table :show-header="false"></beneficiary-table>
  </div>
</template>

<script>
export default {
  props: {
    btnText: {
      type: String,
      default: '',
    },
  },
}
</script>

<style></style>
