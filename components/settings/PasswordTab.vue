<template>
  <div class="profile profile--min-height-50">
    <h3 class="heading-primary u-white u-mb-10">Change Password</h3>
    <p class="u-mb-40">Enter your current password to change to a new one.</p>
    <div class="profile__form profile__form--max-w-30">
      <div class="u-mb-30">
        <p class="u-mb-5">Current Password</p>
        <div class="profile__input-box">
          <input :type="showCurrentPassword ? 'text' : 'password'" />
          <span class="profile__input-extra profile__input-img-box">
            <img
              :src="
                showCurrentPassword
                  ? 'img/eye-off-white.svg'
                  : 'img/eye-on-white.svg'
              "
              alt="eye"
              @click="showCurrentPassword = !showCurrentPassword"
            />
          </span>
        </div>
      </div>
      <div class="u-mb-30">
        <p class="u-mb-5">New Password</p>
        <div class="profile__input-box">
          <input :type="showNewPassword ? 'text' : 'password'" />
          <span class="profile__input-extra profile__input-img-box">
            <img
              :src="
                showNewPassword
                  ? 'img/eye-off-white.svg'
                  : 'img/eye-on-white.svg'
              "
              alt="eye"
              @click="showNewPassword = !showNewPassword"
            />
          </span>
        </div>
      </div>
      <BtnSpinner
        :is-loading="isLoading"
        :is-in-active="isInActive"
        value="Change Password"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoading: false,
      isInActive: false,
      showCurrentPassword: false,
      showNewPassword: false,
    }
  },
}
</script>

<style></style>
