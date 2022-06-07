<template>
  <!-- <div class="topbar__mobile-menu"> -->
  <div class="mobile-menu" :class="[isOpen ? '' : '']">
    <div class="container">
      <div class="mobile-menu__header">
        <router-link class="mobile-menu__logo" to="/"
          ><img src="/img/senex-logo-sm-white.svg" alt="logo"
        /></router-link>
        <!-- <span
          class="mobile-menu__close"
          @click="$emit('closeMobileMenu')"
        ></span> -->
      </div>
      <div class="mobile-menu__item-box">
        <router-link
          v-for="(item, idx) in menu.slice(0, menu.length - 1)"
          :key="idx"
          class="mobile-menu__item"
          :to="item.link"
          @click.native="$emit('closeMobileMenu')"
        >
          <img
            :src="item.icon"
            :alt="item.name"
            class="mobile-menu__item-icon"
          />
          <span>{{ item.name }}</span>
          <span v-if="item.isNew" class="side-menu__item-new"></span>
        </router-link>
        <span class="mobile-menu__item u-pointer" @click="logout">
          <img
            :src="menu[menu.length - 1].icon"
            :alt="menu[menu.length - 1].name"
            class="mobile-menu__item-icon"
          />
          <span>{{ menu[menu.length - 1].name }}</span>
        </span>
      </div>
    </div>
  </div>
  <!-- </div> -->
</template>

<script>
import menu from '@/data/sidebar.js'
export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      menu,
    }
  },
  methods: {
    logout() {
      delete this.$axios.defaults.headers.common.authorization
      this.$auth.logout()
      this.$router.push('/signin')
    },
  },
}
</script>

<style></style>
