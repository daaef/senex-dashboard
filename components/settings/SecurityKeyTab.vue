<template>
  <div class="profile profile--min-height-50">
    <h3 class="heading-primary u-white u-mb-10">Change Security Key</h3>
    <p class="u-mb-40">Enter your security key to change to a new one.</p>
    <div class="profile__form profile__form--max-w-40">
      <div class="u-mb-30">
        <p class="u-mb-5">Current Security Key</p>
        <div class="profile__input-box">
          <input
            v-model="currentSecret"
            :type="showCurrentSecret ? 'text' : 'password'"
          />
          <span class="profile__input-extra profile__input-img-box">
            <img
              :src="
                showCurrentSecret
                  ? 'img/eye-off-white.svg'
                  : 'img/eye-on-white.svg'
              "
              alt="eye"
              @click="showCurrentSecret = !showCurrentSecret"
            />
          </span>
        </div>
      </div>
      <div class="u-mb-30">
        <p class="u-mb-5">New Security Key</p>
        <div class="profile__input-box">
          <input
            v-model="newSecret"
            :type="showNewSecret ? 'text' : 'password'"
          />
          <span class="profile__input-extra profile__input-img-box">
            <img
              :src="
                showNewSecret ? 'img/eye-off-white.svg' : 'img/eye-on-white.svg'
              "
              alt="eye"
              @click="showNewSecret = !showNewSecret"
            />
          </span>
        </div>
      </div>
      <BtnSpinner
        :is-loading="processing"
        :is-in-active="isBtnDisabled()"
        value="Change Security Key"
        :on-submit="changeSecret"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      processing: false,
      showCurrentSecret: false,
      showNewSecret: false,
      currentSecret: '',
      newSecret: '',
    }
  },
  methods: {
    isBtnDisabled() {
      return !this.currentSecret || !this.newSecret
    },
    async changeSecret() {
      const payload = {
        securityKey: this.currentSecret,
        newSecurityKey: this.newSecret,
        type: 'Update',
      }
      this.processing = true
      try {
        const { data } = await this.$api.setSecretKey(payload)
        await this.$auth.fetchUser()
        this.$notify({
          text: 'Secret key updated',
          type: 'success',
        })
        this.currentSecret = ''
        this.newSecret = ''
      } catch (error) {
        this.$notify({
          text: error.response.data.message,
          type: 'error',
        })
      } finally {
        this.processing = false
      }
    },
  },
}
</script>

<style></style>
