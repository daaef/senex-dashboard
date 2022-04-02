<template>
  <div class="profile">
    <div class="profile__header">
      <div class="profile__avatar">{{ getUserInitials() }}</div>
      <div>
        <p class="u-link">Upload your photo</p>
        <p>Maximum size allowed is 600kb of PNG, JPEG ,JPG.</p>
      </div>
    </div>
    <div class="profile__info u-my-20">
      Your profile information is locked for security reason. Please contact
      <span class="u-link">help</span> to make changes.
    </div>
    <div class="profile__form">
      <div class="u-mb-30">
        <p class="u-mb-5">First name</p>
        <div class="profile__input-box profile__input-box--disabled">
          <input type="text" :value="user.firstName" disabled />
        </div>
      </div>
      <div class="u-mb-30">
        <p class="u-mb-5">Last name</p>
        <div class="profile__input-box profile__input-box--disabled">
          <input type="text" :value="user.lastName" disabled />
        </div>
      </div>
      <div class="u-mb-30">
        <p class="u-mb-5">Email address</p>
        <div class="profile__input-box profile__input-box--disabled">
          <input type="email" :value="user.email" disabled />
          <span class="profile__input-extra u-link">Change email</span>
        </div>
      </div>
      <div class="u-mb-30">
        <p class="u-mb-5">Phone number</p>
        <div class="profile__input-box profile__input-box--disabled">
          <input type="text" :value="user.mobile" disabled />
          <span class="profile__input-extra u-link">Change phone number</span>
        </div>
      </div>
      <div class="u-mb-30">
        <p class="u-mb-5">Date of birth</p>
        <div class="profile__input-box">
          <input
            type="text"
            :value="getDateOfBirth()"
            :disabled="isDateOfBirthSet()"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
export default {
  computed: {
    ...mapState('auth', ['user']),
  },
  methods: {
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
    getDateOfBirth() {
      if (this.user.profile.dateOfBirth) {
        return moment(new Date(this.user.dateOfBirth)).format('DD/MM/YYYY')
      }
      return ''
    },
    isDateOfBirthSet() {
      if (this.user.profile.dateOfBirth) {
        return true
      }
      return false
    },
  },
}
</script>

<style></style>
