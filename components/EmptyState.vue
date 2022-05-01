<template>
  <div class="empty-state" :style="{height: height}">
    <h3 class="heading-primary u-white u-mb-20">{{ heading }}</h3>
    <div class="empty-state__content">
      <p class="u-mb-20">{{ content }}</p>
      <BtnSpinner
        :is-in-active="false"
        :is-loading="false"
        :value="btnText"
        :on-submit="btnFunction"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    heading: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
    btnText: {
      type: String,
      default: '',
    },
    btnFunction: {
      type: Function,
      default: () => {},
    },
    height: {
      type: String,
      default: 'auto',
    },
  },
}
</script>

<style></style>
