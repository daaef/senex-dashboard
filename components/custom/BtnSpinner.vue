<template>
  <div>
    <div
      class="btn u-relative"
      :class="[
        isInActive ? 'disabled-color u-pointer-default' : '',
        setClass != '' ? setClass : '',
      ]"
      @click="submit"
    >
      {{ value }}
      <div
        class="btn__overlay u-pointer-default"
        :class="[isLoading ? '' : 'u-none', setClass != '' ? setClass : '']"
      >
        <img src="/img/loading.svg" class="rotate spinner" />
      </div>
      <input style="display: none" type="submit" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
    isInActive: {
      type: Boolean,
      default: false,
    },
    onSubmit: {
      type: Function,
      default: () => {
        // console.log('Empty onclick.')
      },
    },
    value: {
      type: String,
      default: '',
    },
    setClass: {
      type: String,
      default: '',
    },
  },
  methods: {
    submit() {
      if (this.isInActive) {
        return
      }
      this.onSubmit()
    },
  },
}
</script>

<style scoped>
.disabled-color {
  opacity: 0.5;
  cursor: default;
}
</style>
