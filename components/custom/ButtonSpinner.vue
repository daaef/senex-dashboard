<template>
  <div>
    <div
      :style="{
        backgroundColor: background,
        color: color,
        height: '50px',
      }"
      class="btn-spinner-submit"
      :class="[
        isInActive ? 'pointer-off u-opaque-5' : 'u-pointer',
        isLoading ? 'u-none' : 'u-flex',
        setClass != '' ? setClass : '',
      ]"
      @click="submit"
    >
      {{ value }}
    </div>
    <div
      class="btn-style u-mb-20"
      :class="[isLoading ? 'u-block' : 'u-none']"
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

.spinner {
  width: 25px;
  height: 25px;
}

.rotate {
  animation: rotate 2.5s linear infinite;
}
@keyframes rotate {
  to {
    transform: rotate(360deg);
  }
}
</style>
