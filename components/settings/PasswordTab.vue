<template>
  <div class="profile profile--min-height-50">
    <h3 class="heading-primary u-white u-mb-10">Change Password</h3>
    <p class="u-mb-40">Enter your current password to change to a new one.</p>
    <div class="profile__form profile__form--max-w-40">
      <div class="u-mb-30">
        <p class="u-mb-5">Current Password</p>
        <div class="profile__input-box">
          <input
            v-model="currentPassword"
            :type="showCurrentPassword ? 'text' : 'password'"
          />
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
          <input
            v-model="newPassword"
            :type="showNewPassword ? 'text' : 'password'"
          />
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
        :is-loading="processing"
        :is-in-active="isBtnDisabled()"
        value="Change Password"
        :on-submit="changePassword"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      processing: false,
      showCurrentPassword: false,
      showNewPassword: false,
      currentPassword: '',
      newPassword: '',
    }
  },
  methods: {
    isBtnDisabled() {
      return (
        !this.currentPassword ||
        !this.newPassword ||
        this.newPassword.length < 8
      )
    },
    async changePassword() {
      this.processing = true
      const payload = {
        currentPassword: this.currentPassword,
        newPassword: this.newPassword,
      }
      try {
        const { data } = await this.$api.setPassword(payload)
        this.$notify({
          text: 'Password reset successful',
        })
        this.currentPassword = ''
        this.newPassword = ''
        this.processing = false
      } catch (e) {
        this.processing = false
        const errors = e.response.data
        let error = ''
        for (const i in errors) {
          error += errors[i][0] + '. '
        }
        this.$notify({
          text: error,
          type: 'error',
        })
      }
    },
  },
}
</script>

<style></style>
