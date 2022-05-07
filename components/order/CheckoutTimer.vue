<template>
  <div class="chkout-card__header-time-box" :class="[clockColor()]">
    <img
      src="/img/stopwatch.svg"
      alt="clock"
      class="chkout-card__header-clock"
    />
    <client-only>
      <vac :left-time="initialTime" ref="vac" @process="countDown()" @finish="finishCountdown()">
        <template
          v-slot:process="{ timeObj }">
          <span class="chkout-card__header-time">{{ `${timeObj.m} : ${timeObj.s}` }}</span>
          <!-- <span>{{ `Lefttime: ${timeObj.m}:${timeObj.s}` }}</span> -->
        </template>
        <template
          v-slot:finish>
            <span class="chkout-card__header-time">00 : 00</span>
        </template>
        <!-- <span class="chkout-card__header-time">{{ `${timeObj.m}:${timeObj.s}` }}</span> -->
        <!-- <span
          slot="process"
          slot-scope="{ timeObj }">{{ `Lefttime: ${timeObj.m}:${timeObj.s}` }}</span>
        <span slot="finish">Done!</span> -->
      </vac>
    </client-only>
    <!-- <span class="chkout-card__header-time">{{ minutes }} : {{ seconds }}</span> -->
  </div>
</template>

<script>
export default {
  props: {
    timeLeft: {
      type: Number,
      default: 0
    },
    isCheckout: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    // timeLeft(val) {
    //   console.log(val, this.minutes)
    // }
  },
  data() {
    return {
      initialTime: this.timeLeft
    }
  },
  computed: {
    minutes: function() {
      const minutes = Math.floor(this.timeLeft / 60)
      return this.padTime(minutes)
    },
    seconds: function() {
      const seconds = Math.floor(this.timeLeft - (this.minutes * 60))
      return this.padTime(seconds)
    },
  },
  methods: {
    padTime(time) {
      return (time < 10 ? '0' : '') + time
    },
    clockColor() {
      // console.log(this.timeLeft, this.initialTime/2)
      if (this.timeLeft < 60000) {
        return 'chkout-card__header-time-box--red'
      } else if (this.timeLeft < (this.initialTime / 2) ) {
        return 'chkout-card__header-time-box--orange'
      }
      return ''
    },
    printTime() {
      // let vm = this
      // console.log(vm.$refs.vac.timeObj)
    },
    countDown() {
      const vm = this
      const leftTime = vm.$refs.vac.timeObj.leftTime
      // console.log(leftTime)
      if (this.isCheckout) {
        this.$store.dispatch('order/setTotalTime', leftTime)
      } else {
        // this.$emit('setTimeLeft', leftTime) setTimeLeft
        this.$store.dispatch('invoice/setTimeLeft', leftTime)
      }
    },
    finishCountdown() {
      if (this.isCheckout) {
        this.$store.dispatch('order/setTotalTime', 0)
      } else {
        // this.$emit('setTimeLeft', 0)
        this.$store.dispatch('invoice/setTimeLeft', 0)
      }
    }
  }
  
}
</script>

<style>

</style>