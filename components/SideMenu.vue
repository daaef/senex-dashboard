<template>
  <div class="side-menu">
    <div class="side-menu__logo">
      <router-link to="/"
        ><img src="/img/senexpay-logo-light.svg" alt="logo"
      /></router-link>
    </div>
    <div class="side-menu__item-box">
      <router-link
        v-for="(item, idx) in menu.slice(0, menu.length - 1)"
        :key="idx"
        class="side-menu__item"
        :class="[idx === activeIdx ? 'side-menu__item--active' : '']"
        :to="item.link"
        @click.native="activeIdx = idx"
      >
        <img :src="item.icon" :alt="item.name" class="side-menu__item-icon" />
        <span>{{ item.name }}</span>
        <span v-if="item.isNew" class="side-menu__item-new"></span>
      </router-link>
      <span
        class="side-menu__item u-pointer"
        :class="[
          menu.length - 1 === activeIdx ? 'side-menu__item--active' : '',
        ]"
        @click="logout"
      >
        <img
          :src="menu[menu.length - 1].icon"
          :alt="menu[menu.length - 1].name"
          class="side-menu__item-icon"
        />
        <span>{{ menu[menu.length - 1].name }}</span>
      </span>
    </div>
  </div>
</template>

<script>
import menu from '@/data/sidebar.js'
import { mapState } from 'vuex'
export default {
  name: 'SideMenu',
  beforeMount() {
    let path = this.$route.path
    this.activeIdx = this.getCurrentMenuIndex(path)
  },
  watch: {
    routePath(newVal, oldVal) {
      this.activeIdx = this.getCurrentMenuIndex(newVal)
    },
  },
  data() {
    return {
      menu,
      activeIdx: 0,
    }
  },
  computed: {
    ...mapState({
      routePath: (state) => state.routePath,
    }),
  },
  methods: {
    getCurrentMenuIndex(path) {
      return this.menu.findIndex((item) => item.link === path)
    },
    logout() {
      delete this.$axios.defaults.headers.common.authorization
      this.$auth.logout()
      this.$router.push('/signin')
    },
  },
}
</script>

<style></style>
