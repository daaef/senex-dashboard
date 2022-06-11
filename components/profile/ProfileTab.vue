<template>
  <div class="profile">
    <div class="profile__header">
      <div class="profile__avatar">
        <img v-if="computeSrc()" :src="computeSrc()" alt="profile-image" />
        <span v-else>{{ getUserInitials() }}</span>
      </div>
      <div>
        <label class="u-link" for="profile-img">Upload your photo</label>
        <input
          class="u-none"
          type="file"
          ref="fileInput"
          id="profile-img"
          name="profile-img"
          accept="image/*"
          @input="fileAdded"
        />
        <p>Maximum size allowed is 600kb of PNG, JPEG, JPG.</p>
      </div>
    </div>
    <div class="profile__info u-my-20">
      <img src="img/icons/info_yellow_round_icon.svg" alt="info" />
      <p>
        Your profile information is locked for security reason. Please contact
        <span class="u-link">help</span> to make changes.
      </p>
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
        <div
          class="profile__input-box u-pr-50"
          :class="[lockEmail ? 'profile__input-box--disabled' : '']"
        >
          <input type="email" :value="user.email" :disabled="lockEmail" />
          <span
            class="profile__input-extra u-link"
            @click="lockEmail = !lockEmail"
            >Change</span
          >
        </div>
      </div>
      <div class="u-mb-30">
        <p class="u-mb-5">Phone number</p>
        <div
          class="profile__input-box u-pr-50"
          :class="[lockPhone ? 'profile__input-box--disabled' : '']"
        >
          <input type="text" :value="user.mobile" :disabled="lockPhone" />
          <span
            class="profile__input-extra u-link"
            @click="lockPhone = !lockPhone"
            >Change</span
          >
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
  data() {
    return {
      lockEmail: true,
      lockPhone: true,
      processing: false,
      photo: null,
      uploadUrl: '',
      previewImage: '',
    }
  },
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
    computeSrc() {
      if (this.user && this.user.profile && this.user.profile.photo) {
        return this.user.profile.photo
      } else if (this.previewImage) {
        return this.previewImage
      }
      return ''
    },
    toBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
      })
    },
    async fileAdded() {
      const input = this.$refs.fileInput
      const files = input.files
      let file
      if (files && files[0]) {
        file = files[0]
      } else {
        return
      }
      this.processing = true
      this.previewImage = await this.toBase64(file)
      const payload = new FormData()
      payload.append('file', file)
      try {
        const { data } = await this.$api.uploadFile(payload)
        this.uploadUrl = data.data
        await this.$api.updateProfile({
          photo: this.uploadUrl,
        })
        this.processing = false
        await this.$auth.fetchUser()
      } catch (error) {
        let textMessage = 'Network error'
        if (error.status) {
          textMessage = error.response.data.message
        }
        this.$notify({
          text: textMessage,
          type: 'error',
        })
        this.processing = false
        this.previewImage = null
        this.photo = null
        this.uploadUrl = ''
      }
    },
  },
}
</script>

<style></style>
