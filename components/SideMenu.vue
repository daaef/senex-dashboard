<template>
  <div class="side-menu">
    <div class="side-menu__logo">
      <router-link to="/"
        ><img src="/img/senexpay-logo-light.svg" alt="logo"
      /></router-link>
    </div>
    <div class="side-menu__item-box">
      <router-link
        v-for="(item, idx) in menu"
        :key="idx"
        class="side-menu__item"
        :class="[idx === activeIdx ? 'side-menu__item--active' : '']"
        :to="item.link"
        @click.native="activeIdx = idx"
      >
        <img :src="item.icon" :alt="item.name" class="side-menu__item-icon" />
        <span>{{ item.name }}</span>
      </router-link>
    </div>
  </div>
</template>

<script>
import menu from '@/data/sidebar.js'
export default {
  name: 'SideMenu',
  beforeMount() {
    this.activeIdx = this.getCurrentMenuIndex()
  },
  data() {
    return {
      menu,
      activeIdx: 0,
    }
  },
  methods: {
    getCurrentMenuIndex() {
      let path = this.$route.path
      return this.menu.findIndex((item) => item.link === path)
    },
  },
}
</script>

<style></style>
