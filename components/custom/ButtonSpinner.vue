<template>
  <div>
    <div
      :style="{
        backgroundColor: background,
        color: color,
        opacity: isInActive ? '0.5' : '1',
      }"
      class="submit-btn"
      :class="[
        isInActive ? 'pointer-off' : '',
        isLoading ? 'hide' : 'show-flex',
        setClass != '' ? setClass : '',
      ]"
      @click="submit"
    >
      {{ value }}
    </div>
    <div
      class="btn-style u-mb-20"
      :class="[isLoading ? 'show' : 'hide']"
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

<style scoped>
.show {
  display: block;
}

.show-flex {
  display: flex;
}

.btn-style {
  height: 50px;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hide {
  display: none;
}

.spinner {
  width: 25px;
  height: 25px;
}

.pointer-on {
  cursor: pointer;
}

.pointer-off {
  cursor: default;
}

.submit-btn {
  /* color: #ffffff; */
  width: 100%;
  height: 50px !important;
  padding: 15px;
  border-radius: 6px;
  font-size: 16px;
  border: 1px solid transparent;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
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
