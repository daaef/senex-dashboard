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
        You are not allowed to modify sensitive profile information at the
        moment. Please contact
        <a :href="`${url}/contact`" target="_blank" rel="noopener noreferrer"
          ><span class="u-link">help</span></a
        >
        to make any changes.
      </p>
    </div>
    <div class="profile__form">
      <div class="u-mb-30">
        <p class="u-mb-5">First name</p>
        <div class="profile__input-box profile__input-box--disabled">
          <input type="text" :value="user.firstName" disabled />
          <div class="lock-icon" @mouseover="showTooltip(1)" @mouseout="hideTooltip(1)">
            <div class="mr-2 cursor-pointer">
              <i class='bx bxs-lock'></i>
            </div>
            <div id="tooltip1" role="tooltip" class="z-20 -mt-20 w-64 absolute transition duration-150 ease-in-out left-0 ml-8 shadow-lg bg-white p-4 rounded hidden">
              <svg class="absolute left-0 -ml-2 bottom-0 top-0 h-full" width="9px" height="16px" viewBox="0 0 9 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g id="Tooltips-" transform="translate(-874.000000, -1029.000000)" fill="#FFFFFF">
                    <g id="Group-3-Copy-16" transform="translate(850.000000, 975.000000)">
                      <g id="Group-2" transform="translate(24.000000, 0.000000)">
                        <polygon id="Triangle" transform="translate(4.500000, 62.000000) rotate(-90.000000) translate(-4.500000, -62.000000) " points="4.5 57.5 12.5 66.5 -3.5 66.5"></polygon>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
              <p>Your profile information is locked for security reasons. Please contact help to make changes.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="u-mb-30">
        <p class="u-mb-5">Last name</p>
        <div class="profile__input-box profile__input-box--disabled">
          <input type="text" :value="user.lastName" disabled />
          <div class="lock-icon" @mouseover="showTooltip(2)" @mouseout="hideTooltip(2)">
            <div class="mr-2 cursor-pointer">
              <i class='bx bxs-lock'></i>
            </div>
            <div id="tooltip2" role="tooltip" class="z-20 -mt-20 w-64 absolute transition duration-150 ease-in-out left-0 ml-8 shadow-lg bg-white p-4 rounded hidden">
              <svg class="absolute left-0 -ml-2 bottom-0 top-0 h-full" width="9px" height="16px" viewBox="0 0 9 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g id="Tooltips-" transform="translate(-874.000000, -1029.000000)" fill="#FFFFFF">
                    <g id="Group-3-Copy-16" transform="translate(850.000000, 975.000000)">
                      <g id="Group-2" transform="translate(24.000000, 0.000000)">
                        <polygon id="Triangle" transform="translate(4.500000, 62.000000) rotate(-90.000000) translate(-4.500000, -62.000000) " points="4.5 57.5 12.5 66.5 -3.5 66.5"></polygon>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
              <p>Your profile information is locked for security reasons. Please contact help to make changes.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="u-mb-30">
        <p class="u-mb-5">Email address</p>
        <div
          class="profile__input-box u-pr-50"
          :class="[lockEmail ? 'profile__input-box--disabled' : '']"
        >
          <input type="email" v-model="editableEmail" :disabled="lockEmail" />
          <span
            class="profile__input-extra u-link"
            @click="() => openSecretKeyModal('email')"
            >Change</span
          >
        </div>
        <div v-if="!lockEmail" class="profile__twin-btn u-mt-20">
          <BtnSpinner
            :is-in-active="false"
            :is-loading="false"
            value="Cancel"
            :on-submit="
              () => {
                lockEmail = true
                editableEmail = user.email
              }
            "
            setClass="profile__cancel-btn"
          />
          <BtnSpinner
            :is-in-active="false"
            :is-loading="false"
            value="Verify email"
            :on-submit="
              () => {
                emailCodeModal = true
              }
            "
          />
        </div>
      </div>
      <div class="u-mb-30">
        <p class="u-mb-5">Phone number</p>
        <div
          class="profile__input-box u-pr-50"
          :class="[lockPhone ? 'profile__input-box--disabled' : '']"
        >
          <input type="text" v-model="editablePhone" :disabled="lockPhone" />
          <span
            class="profile__input-extra u-link"
            @click="() => openSecretKeyModal('phone')"
            >Change</span
          >
        </div>
        <div v-if="!lockPhone" class="profile__twin-btn u-mt-20">
          <BtnSpinner
            :is-in-active="false"
            :is-loading="false"
            value="Cancel"
            :on-submit="
              () => {
                lockPhone = true
                editablePhone = user.mobile
              }
            "
            setClass="profile__cancel-btn"
          />
          <BtnSpinner
            :is-in-active="false"
            :is-loading="false"
            value="Verify phone number"
            :on-submit="
              () => {
                phoneCodeModal = true
              }
            "
          />
        </div>
      </div>
      <div class="u-mb-30">
        <p class="u-mb-5">Date of birth</p>
        <div class="profile__input-box">
          <input
            type="date"
            :value="getDateOfBirth()"
            :disabled="!isDateOfBirthSet"
          />
          <div class="lock-icon" @mouseover="showTooltip(3)" @mouseout="hideTooltip(3)">
            <div class="mr-2 cursor-pointer">
              <i class='bx bxs-lock'></i>
            </div>
            <div id="tooltip3" role="tooltip" class="z-20  w-64 absolute transition duration-150 ease-in-out left-0 ml-8 hidden">
              <svg class="absolute left-0 -ml-2 bottom-0 top-0 h-full" width="9px" height="16px" viewBox="0 0 9 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g id="Tooltips-" transform="translate(-874.000000, -1029.000000)" fill="#FFFFFF">
                    <g id="Group-3-Copy-16" transform="translate(850.000000, 975.000000)">
                      <g id="Group-2" transform="translate(24.000000, 0.000000)">
                        <polygon id="Triangle" transform="translate(4.500000, 62.000000) rotate(-90.000000) translate(-4.500000, -62.000000) " points="4.5 57.5 12.5 66.5 -3.5 66.5"></polygon>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
              <p>Your profile information is locked for security reasons. Please contact help to make changes.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <vue-final-modal v-model="secretKeyModal">
      <div class="benef-overlay container">
        <EnterSecret
          @action="secretAction"
          @closeModal="secretKeyModal = false"
        />
      </div>
    </vue-final-modal>
    <vue-final-modal v-model="phoneCodeModal">
      <div class="benef-overlay container">
        <MobileVerification
          v-if="phoneCodeModal"
          :mobile="editablePhone"
          @action="
            () => {
              lockPhone = true
            }
          "
          @closeModal="phoneCodeModal = false"
        />
      </div>
    </vue-final-modal>
    <vue-final-modal v-model="emailCodeModal">
      <div class="benef-overlay container">
        <EmailVerification
          v-if="emailCodeModal"
          :email="editableEmail"
          @action="successEmailAction"
          @closeModal="emailCodeModal = false"
        />
      </div>
    </vue-final-modal>
    <vue-final-modal v-model="passwordModal">
      <div class="benef-overlay container">
        <EnterPassword
          v-if="passwordModal"
          :processing="processing"
          @action="changeEmail"
          @closeModal="passwordModal = false"
        />
      </div>
    </vue-final-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import EmailVerification from '../modal/EmailVerification.vue'
import MobileVerification from '../modal/MobileVerification.vue'
export default {
  components: { EmailVerification, MobileVerification },
  data() {
    return {
      lockEmail: true,
      lockPhone: true,
      processing: false,
      photo: null,
      url: '',
      uploadUrl: '',
      previewImage: '',
      secretKeyModal: false,
      mode: 'email',
      editableEmail: '',
      editablePhone: '',
      emailCodeModal: false,
      phoneCodeModal: false,
      passwordModal: false,
      newEmail: '',
      secretKey: '',
    }
  },
  computed: {
    isDateOfBirthSet() {
      if (this.user?.profile?.dateOfBirth) {
        return true
      }
      return false
    },
    ...mapState('auth', ['user']),
  },
  mounted() {
    this.editableEmail = this.user.email
    this.editablePhone = this.user.mobile
    this.url = process.env.SENEX_LANDING_SITE_URL
  },
  methods: {
    showTooltip(flag) {
      switch (flag) {
        case 1:
          document.getElementById("tooltip1").classList.remove("hidden");
          break;
        case 2:
          document.getElementById("tooltip2").classList.remove("hidden");
          break;
        case 3:
          document.getElementById("tooltip3").classList.remove("hidden");
          break;
      }
    },
    hideTooltip(flag) {
      switch (flag) {
        case 1:
          document.getElementById("tooltip1").classList.add("hidden");
          break;
        case 2:
          document.getElementById("tooltip2").classList.add("hidden");
          break;
        case 3:
          document.getElementById("tooltip3").classList.add("hidden");
          break;
      }
    },
    openSecretKeyModal(mode) {
      this.mode = mode
      this.secretKeyModal = true
    },
    secretAction(key) {
      if (this.mode == 'email') {
        this.secretKey = key
        this.lockEmail = false
      } else {
        this.lockPhone = false
      }
      this.secretKeyModal = false
    },
    successEmailAction() {
      this.passwordModal = true
      this.emailCodeModal = false
    },
    async changeEmail(password, callback) {
      const payload = {
        newEmail: this.editableEmail,
        secretKey: this.secretKey,
        currentPassword: password,
      }
      this.processing = true
      await this.$api.changeEmail(payload)
      try {
        await this.$auth.fetchUser()
        this.$notify({
          type: 'success',
          text: 'Email changed successfully',
        })
      } catch (e) {
        this.$notify({
          type: 'error',
          message: e.message || 'Something went wrong',
        })
      } finally {
        callback()
        this.processing = false
        this.passwordModal = false
        this.lockEmail = true
      }
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
    getDateOfBirth() {
      if (this.user.profile.dateOfBirth) {
        return moment(new Date(this.user.profile.dateOfBirth)).format('DD/MM/YYYY')
      }
      return ''
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

<style lang="scss">
  .profile__input-box {
    position: relative;
    input {
      &:disabled {
        & ~ .lock-icon {
          display: inline;
        }
      }
      & ~ .lock-icon {
        position: absolute;
        right: 13px;
        top: 0;
        font-size: 20px;
        transform: translateY(50%);
        display: none;
        .cursor-pointer {
          line-height: 0;
        }
      }
    }
  }
  #tooltip3 {
    top: 0;
    transform: translateY(-35%);
  }
  [role="tooltip"] {
    background: #404043;
    border-radius: 10px;
    padding: 15px;
    svg {
      g {
        g {
          fill: #404043;
        }
      }
    }
    p {
      color: #fafafa;
      font-weight: 500;
      line-height: 1.2em;
      font-size: 1.5rem;
    }
  }
</style>
