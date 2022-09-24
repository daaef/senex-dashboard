<template>
  <div class="profile">
    <EmptyState
      v-if="!hasNextOfKin && !showForm"
      heading="No Next Of Kin"
      content="Your Next Of Kin information will show up here when you add it."
      btnText="Add Next Of Kin"
      :btnFunction="
        () => {
          showForm = true
        }
      "
      height="60vh"
    />
    <template v-else>
      <div class="profile__info u-mb-30">
        <p>
          Your Next of Kin is the closest living relative to you. We will
          contact/reach this person if we are unable to make contact with you
          after a long period of time.
          <a :href="`${url}/terms`" class="u-link">Learn more</a>
          about our Next of Kin Policy.
        </p>
      </div>
      <h3 class="heading-primary u-white u-mb-20">Next of Kin Information</h3>
      <div class="profile__form">
        <div class="u-mb-30">
          <p class="u-mb-5">Full name</p>
          <div
            class="profile__input-box"
            :class="[
              hasNextOfKin && !edit ? 'profile__input-box--disabled' : '',
            ]"
          >
            <input
              type="text"
              v-model="nextOfKin.name"
              :disabled="hasNextOfKin && !edit"
            />
          </div>
        </div>
        <div class="u-mb-30">
          <p class="u-mb-5">Email address</p>
          <div
            class="profile__input-box"
            :class="[
              hasNextOfKin && !edit ? 'profile__input-box--disabled' : '',
            ]"
          >
            <input
              type="email"
              v-model="nextOfKin.email"
              :disabled="hasNextOfKin && !edit"
            />
          </div>
        </div>
        <div class="u-mb-30">
          <p class="u-mb-5">Phone number</p>
          <div
            class="profile__input-box"
            :class="[
              hasNextOfKin && !edit ? 'profile__input-box--disabled' : '',
            ]"
          >
            <input
              type="text"
              v-model="nextOfKin.mobile"
              :disabled="hasNextOfKin && !edit"
            />
          </div>
        </div>
        <div class="u-mb-30">
          <p class="u-mb-5">Date of birth</p>
          <div
            class="profile__input-box"
            :class="[
              hasNextOfKin && !edit ? 'profile__input-box--disabled' : '',
            ]"
          >
            <input type="text" :disabled="hasNextOfKin && !edit" />
          </div>
        </div>
        <!-- <button class="btn">Edit Next Of Kin</button> -->
        <BtnSpinner
          v-if="hasNextOfKin && !edit"
          :is-in-active="false"
          :is-loading="false"
          value="Edit Next Of Kin"
          :on-submit="
            () => {
              edit = true
            }
          "
        />
        <div v-else-if="!hasNextOfKin || edit" class="u-flex">
          <BtnSpinner
            :is-in-active="false"
            :is-loading="false"
            value="Cancel"
            :on-submit="handleCancel"
            setClass="profile__cancel-btn u-mr-20"
          />
          <BtnSpinner
            :is-in-active="false"
            :is-loading="processing"
            value="Save changes"
            :on-submit="handleChangeKin"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      processing: false,
      showForm: false,
      edit: false,
      nextOfKin: {
        name: '',
        email: '',
        mobile: '',
      },
      hasNextOfKin: false,
      url: '',
    }
  },
  mounted() {
    this.url = process.env.SENEX_LANDING_SITE_URL
    if (this.user && this.user.profile && this.user.profile.nextOfKin) {
      this.nextOfKin = {
        ...this.user.profile.nextOfKin,
      }
      this.hasNextOfKin = true
    } else {
      this.hasNextOfKin = false
    }
  },
  computed: {
    ...mapState('auth', ['user']),
  },
  methods: {
    handleCancel() {
      this.showForm = false
      this.edit = false
    },
    async handleChangeKin() {
      this.processing = true
      await this.$api.updateProfile({
        nextOfKin: this.nextOfKin,
      })
      this.processing = false
      this.edit = false
      await this.$auth.fetchUser()
    },
  },
}
</script>

<style></style>
