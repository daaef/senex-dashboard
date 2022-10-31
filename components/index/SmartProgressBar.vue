<template>
  <div
    class="index-complete-kyc flex-wrap u-mb-20"
  >
    <div class="flex items-center">
      <!--          <i class='bx bx-target-lock'></i>-->
      <img v-if="completedSetupCount === 4" src="/img/celebration.svg" class="grid-img" alt="Island">
      <img v-else src="/img/island.png" class="grid-img" alt="Island">
    </div>
    <div class="progress--bar-holder">
      <div class="message text-3xl font-bold">{{ completedSetupCount === 4 ?
        'Congratulations! You\'re good to go ' :
        'You\'re a few steps closer to treasure island' }}</div>
      <div class="index-complete-kyc__info u-mr-10">
        <!--            <img
                      src="/img/icons/green_round_checkmark.svg"
                      alt="checkmark"
                      class="u-mr-10"
                    />-->
        <p v-if="!countNextOfKin" class="text-md">Provide 'Next of Kin' details</p>
        <p v-else-if="!completedOrders" class="text-md">Perform your first transaction </p>
        <p v-else-if="!referrals" class="text-md">Invite a friend to signup and complete a transaction </p>
        <p v-else-if="!isApproved" class="text-md">Complete your KYC Verification </p>
        <p v-else class="text-md">Earn more rewards by inviting more friends</p>
      </div>
      <div class="w-full flex justify-between max-w-lg items-center">
        <div class="progress-bar">
          <div class="w-full bg-gray-700 rounded-full h-2.5 dark:bg-gray-700">
            <div :class="completedSetupCount === 4 ? 'from-green-400 to-green-600': 'from-blue-500 to-purple-600'" class="bg-gradient-to-r h-2.5 rounded-full" :style="`width: ${60 + (10 * completedSetupCount)}%`"></div>
          </div>
        </div>
        <span class="ml-6 u-link">{{ `${60 + (10 * completedSetupCount)}%` }}</span>
      </div>
    </div>
    <nuxt-link :to="`${!countNextOfKin ?
          '/profile/next-of-kin' : !completedOrders ?
          '/order/start' : !referrals ?
          '/invite' : !isApproved ? 'kyc-verification' : '/invite' }`"
               class="index-complete-kyc__link-box u-pointer"
    >
      <p class="u-link u-mr-10">{{ completedSetupCount === 4 ? 'Invite Friend' : 'Complete' }}</p>
      <svg
        class="icon u-link"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 11.115 18"
      >
        <path
          id="Icon_material-navigate-next"
          data-name="Icon material-navigate-next"
          d="M15,9l-2.115,2.115L19.755,18l-6.87,6.885L15,27l9-9Z"
          transform="translate(-12.885 -9)"
          fill="#ffffff"
        />
      </svg>
    </nuxt-link>
  </div>
</template>

<script>
export default {
  name: "SmartProgressBar",
  props:{
    orders: {
      type: Array,
      default: () => [],
    },
    user: {
      type: Object,
      default: () => {},
    },
    referrals: {
      type: Number,
      default: () => 0,
    }
  },
  computed: {
    isApproved() {
      return this.user?.profile?.status === 'Approved'
    },
    completedOrders() {
      return this.orders.filter(order => order.status === "complete").length
    },
    countNextOfKin() {
      return !!this.user?.profile?.nextOfKin?.dateOfBirth &&
        !!this.user?.profile?.nextOfKin?.email &&
        !!this.user?.profile?.nextOfKin?.mobile &&
        !!this.user?.profile?.nextOfKin?.name
    },
    completedSetupCount() {
      return Number(!!this.referrals) +
        Number(this.countNextOfKin) +
        Number(!!this.completedOrders) +
        Number(this.isApproved)
    },
  }
};
</script>

<style scoped>

</style>
