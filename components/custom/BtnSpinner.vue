<template>
  <div>
    <div
      class="btn u-relative"
      :class="[
        isInActive ? 'disabled-color pointer-off' : '',
        setClass != '' ? setClass : '',
      ]"
      @click="submit"
    >
      {{ value }}
      <div
        class="btn__overlay pointer-off"
        :class="[isLoading ? '' : 'hide', setClass != '' ? setClass : '']"
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
.hide {
  display: none;
}

.spinner {
  width: 25px;
  height: 25px;
}

.disabled-color {
  opacity: 0.5;
  cursor: default;
}

.pointer-off {
  cursor: default;
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
