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
          v-for="(item, idx) in menu"
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
        </router-link>
      </div>
      <div>
        <span class="u-pointer mobile-menu__item" @click="logout">Logout</span>
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
