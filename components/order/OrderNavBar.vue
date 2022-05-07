<template>
  <div class="order">
    <div class="nav-bar">
      <div class="">
        <div class="nav-bar__con">
          <div class="nav-bar__logo-box">
            <router-link to="/signin">
              <img src="/img/senex-full-logo.svg" alt="Logo" class="nav-bar__logo" />
            </router-link>
          </div>
          <div v-if="user && user.profile" class="nav-bar__profile-box">
            <span>{{ user && user.profile ? `Hi, ${user.firstName}` : '' }}</span>
            <span v-if="user && user.profile && user.profile.photo" class="nav-bar__profile-img">
              <img :src="user.profile.photo" alt="profile image" class="u-rounded" /></span
            >
            <span v-else class="nav-bar__profile-img nav-bar__profile-img--center u-fw-500">{{ user && user.profile ? user.firstName[0] : '' }}</span>
            <!-- <span class="nav-bar__profile-img"><img
            :src="
              user && user.profile && user.profile.photo
                ? user.profile.photo
                : '/img/user-avatar.svg'
            "
            alt="profile image" class="u-rounded"></span> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {

    }
  },
  computed: {
    ...mapState('auth', ['user'])
  },
}
</script>

<style></style>
