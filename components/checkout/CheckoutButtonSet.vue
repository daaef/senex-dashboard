<template>
  <div :class="[down ? 'u-mt-auto' : '']">
    <div class="checkout__btn-box">
      <div class="checkout__btn">
        <ButtonSpinner
          :is-loading="left.isLoading"
          :is-in-active="left.isInActive"
          :value="left.value"
          :background="left.background"
          :color="left.color"
          :setClass="left.setClass"
          :on-submit="left.onSubmit"
        />
      </div>
      <div class="checkout__btn">
        <ButtonSpinner
          :is-loading="right.isLoading"
          :is-in-active="right.isInActive"
          :value="right.value"
          :background="right.background"
          :color="right.color"
          :setClass="right.setClass"
          :on-submit="right.onSubmit"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    down: {
      type: Boolean,
      default: false
    },
    left: {
      type: Object,
      default: () => {
        return {
          value: 'Back',
          background: '#A9CAFC',
          color: '#053888',
          isLoading: false,
          isInActive: true,
          setClass: '',
          onSubmit: ()=> {}
        }
      }
    },
    right: {
      type: Object,
      default: () => {
        return {
          value: 'Continue',
          background: '#053888',
          color: '#ffffff',
          isLoading: false,
          isInActive: true,
          setClass: '',
          onSubmit: ()=> {}
        }
      }
    }
  }
}
</script>

<style>

</style>