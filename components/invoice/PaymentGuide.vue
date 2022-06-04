<template>
  <div class="guide">
    <div class="guide__header">
      <span class="guide__info-icon"></span>
      <p class="heading-secondary">PAYMENT GUIDE</p>
    </div>
    <ul>
      <li>
        Please make transfers to the bank account using the first 3 characters
        of your invoice ID as “description/ memo note” to avoid issues with our
        system detecting your payments.
      </li>
      <li>
        The account is only valid for a 1 time usage. It is advisable to send
        exact or a little more than the expected amount to prevent transaction
        stalls.
      </li>
    </ul>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss">
.guide {
  background-color: #fae9c4;
  border-radius: 10px;
  border-top: 10px solid #ff6e14;
  padding: 20px;
  align-self: flex-start;

  &__header {
    display: flex;
    margin-bottom: 20px;
  }

  &__info-icon {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    margin-right: 10px;
    display: inline-block;
  }

  ul {
    list-style-position: inside;
    padding-left: 0;
  }

  li {
    &:not(:last-child) {
      margin-bottom: 25px;
    }
  }
}
</style>
