<template>
  <div class="container topbar">
    <h1 class="topbar__page-title heading-primary">{{ getPath() }}</h1>
    <div class="topbar__actions">
      <div class="topbar__theme-switch-box"></div>
      <button class="topbar__btn">Buy/Sell</button>
      <span class="topbar__line"></span>
      <div class="topbar__user" @click="showModal = true">
        {{ getUserInitials() }}
      </div>
    </div>
    <vue-final-modal v-model="showModal">
      <div class="topbar-overlay">
        <div @click="showModal = false" class="container topbar-overlay__main">
          <div class="topbar-overlay__content">
            <div class="topbar-overlay__avatar u-mb-30">
              {{ getUserInitials() }}
            </div>
            <p class="fw-700">{{ getUserFullName() }}</p>
            <p>{{ user.email }}</p>
            <div class="topbar-overlay__list-box">
              <router-link to="/settings" class="topbar-overlay__list-item"
                >Settings</router-link
              ><router-link to="/invite" class="topbar-overlay__list-item"
                >Referrals & Rewards</router-link
              ><router-link to="/settings" class="topbar-overlay__list-item"
                >Settings</router-link
              >
            </div>
          </div>
        </div>
      </div>
    </vue-final-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      showModal: false,
    }
  },
  computed: {
    ...mapState('auth', ['user']),
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
    getUserFullName() {
      if (this.user.firstName && this.user.lastName) {
        return `${this.user.firstName} ${this.user.lastName}`
      }
      return ''
    },
  },
}
</script>

<style></style>
