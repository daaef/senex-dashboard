<template>
  <div>
    <div class="chkout-step">
      <div v-for="(item, idx) in steps" :key="idx" class="chkout-step__item">
        <span
          class="chkout-step__item-step"
          :class="[currentStep >= item.value ? 'chkout-step__item-step--active' : '']"
        >{{ item.value }}</span>
        <span
          class="chkout-step__item-text"
          :class="[currentStep == item.value ? 'chkout-step__item-text--active' : '']"
        >{{ item.text }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      steps: [
        {
          value: 1,
          text: 'Calculator'
        },
        {
          value: 2,
          text: 'Account validation'
        },
        {
          value: 3,
          text: 'Beneficiary'
        },
        {
          value: 4,
          text: 'Checkout'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      currentStep: state => state.order.currentOrderStep
    })
  }
}
</script>

<style>

</style>