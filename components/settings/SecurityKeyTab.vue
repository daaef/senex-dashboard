<template>
  <div class="profile profile--min-height-50">
    <h3 class="heading-primary u-white u-mb-10">Change Security Key</h3>
    <p class="u-mb-40">Enter your security key to change to a new one.</p>
    <div class="profile__form profile__form--max-w-30">
      <div class="u-mb-30">
        <p class="u-mb-5">Current Security Key</p>
        <div class="profile__input-box">
          <input :type="showCurrentSecret ? 'text' : 'password'" />
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
          <input :type="showNewSecret ? 'text' : 'password'" />
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
        :is-loading="false"
        :is-in-active="false"
        value="Change Security Key"
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
      showCurrentSecret: false,
      showNewSecret: false,
    }
  },
}
</script>

<style></style>
