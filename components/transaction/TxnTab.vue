<template>
  <div class="txn-tab">
    <div class="txn-tab__header u-my-30">
      <div class="txn-tab__search-box">
        <img src="h.png" alt="" class="txn-tab__search-icon" />
        <input type="text" class="txn-tab__search-input" placeholder="Search" />
      </div>
      <div class="txn-tab__page-box">
        <span>1-16 of 16</span>
        <div class="txn-tab__arrow-box"></div>
      </div>
    </div>
    <transaction-table :show-header="false"></transaction-table>
  </div>
</template>

<script>
export default {}
</script>

<style></style>
