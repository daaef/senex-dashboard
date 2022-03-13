<template>
  <div class="container topbar">
    <h1 class="topbar__page-title heading-primary">{{ getPath() }}</h1>
    <div class="topbar__actions">
      <div class="topbar__theme-switch-box"></div>
      <button class="topbar__btn">Buy/Sell</button>
      <span class="topbar__line"></span>
      <div class="topbar__user">AA</div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    getPath() {
      let path = this.$route.path
      if (path === '/' || path === '/dashboard') {
        path = '/dashboard'
      }
      path = path.split('/')[1]
      return path.replace(/^\//, '')
    },
  },
}
</script>

<style></style>
