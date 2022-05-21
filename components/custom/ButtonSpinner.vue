<template>
  <div>
    <div
      :style="{
        backgroundColor: background,
        color: color,
      }"
      class="btn-spinner-submit"
      :class="[
        isInActive ? 'u-pointer-default u-opaque-5' : 'u-pointer',
        isLoading ? 'u-none' : 'u-flex',
        setClass != '' ? setClass : '',
      ]"
      @click="submit"
    >
      {{ value }}
    </div>
    <div
      class="btn-style u-mb-20"
      :class="[
        isLoading ? 'u-flex u-flex--w-center u-flex--w-center' : 'u-none',
      ]"
      :style="{ backgroundColor: background }"
    >
      <img src="/img/loading.svg" class="rotate spinner" />
    </div>
    <input style="display: none" type="submit" />
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
    background: {
      type: String,
      default: '#0b913a',
    },
    color: {
      type: String,
      default: '#ffffff',
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

<style>
.btn-style {
  height: 50px;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
