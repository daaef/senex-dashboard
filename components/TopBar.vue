<template>
  <div class="container topbar">
    <h1 class="topbar__page-title heading-primary">{{ getPath() }}</h1>
    <div class="topbar__actions">
      <div class="topbar__theme-switch-box"></div>
      <button class="topbar__btn">Buy/Sell</button>
      <span class="topbar__line"></span>
      <div class="topbar__user">{{ getUserInitials() }}</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState('auth', ['user'])
  },
  methods: {
    getPath() {
      let path = this.$route.path
      if (path === '/' || path === '/dashboard') {
        path = '/dashboard'
      }
      path = path.split('/')[1]
      return path.replace(/^\//, '')
    },
    getUserInitials() {
      let initials = ''
      if (this.user.firstName) {
        initials += this.user.firstName[0]
      }
      if (this.user.lastName) {
        initials += this.user.lastName[0]
      }
      return initials
    },
  },
}
</script>

<style></style>
