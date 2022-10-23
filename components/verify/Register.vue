<template>
  <div class="auth sign-up">
    <div class="auth__form-logo-box">
      <LogoImage />
      <div class="auth__form-box">
        <form class="auth__form" @submit.prevent="onSubmit">
          <h3 class="fw-bold u-text-center u-mb-30">CREATE YOUR ACCOUNT</h3>
          <div class="auth__label-input-box u-mb-30">
            <label class="">First name</label>
            <div class="auth__input-box">
              <input v-model="firstName" type="text" />
            </div>
          </div>
          <div class="auth__label-input-box u-mb-30">
            <label class="">Surname</label>
            <div class="auth__input-box">
              <input v-model="lastName" type="text" />
            </div>
          </div>
          <div class="auth__label-input-box u-mb-30">
            <label class="">Email</label>
            <div class="auth__input-box">
              <input v-model="email" type="email" />
            </div>
          </div>
          <div class="auth__label-input-box u-mb-30">
            <label class=""
              >Phone number
              <span class="use-active"
                >(Please use an active phone number)</span
              ></label
            >
            <div class="select-input">
<!--              <v-select
                :options="countries"
                :reduce="(country) => country.value"
                v-model="countryCode"
                :placeholder="countryCode"
                label="value"
                :clearable="false"
                :searchable="false"
              >
                <template #option="{ text }">
                  <span>{{ text }}</span>
                </template>
              </v-select>-->
              <vue-country-code
                class="mr-2"
                @onSelect="onSelectCountry"
                :enableSearchField="true"
                :enabledCountryCode="true"
                :enabledFlags="false"
                :onlyCountries="['ng', 'za', 'gh', 'ke', 'gb', 'us', 'ca', 'ae', 'tr']"
              />
              <!-- <b-dropdown id="dropdown-menu" :text="countryCode">
                <b-dropdown-item
                  v-for="country in countries"
                  :key="country.value"
                  :value="country.value"
                  @click="countryCode = country.value"
                >
                  {{ country.text }}
                </b-dropdown-item>
              </b-dropdown> -->
              <div class="auth__input-box">
                <input
                  v-model="mobileSuffix"
                  autocomplete="off"
                  type="text"
                  @keypress="isNumber"
                />
              </div>
            </div>
          </div>
          <div class="auth__label-input-box u-mb-30">
            <label class="">Password</label>
            <div class="auth__input-box">
              <input
                v-model="password"
                class="input-element"
                :type="passwordLocked"
                placeholder="Password"
              />
              <img
                :src="[
                  passwordLocked !== 'password'
                    ? '/img/eye-on.svg'
                    : '/img/eye-off.svg',
                ]"
                alt="eye"
                class="auth__pwd-eye"
                @click="togglePassword"
              />
            </div>
            <span
              class="validation-span"
              :class="[hideValidation ? 'hide' : 'show']"
              ><i
                class="las la-circle dot"
                :class="[
                  passValid.charLen === 2
                    ? 'green-dot'
                    : passValid.charLen === 1
                    ? 'red-dot'
                    : '',
                ]"
              ></i
              >Use 8 or more characters</span
            >
            <span
              class="validation-span"
              :class="[hideValidation ? 'hide' : 'show']"
              ><i
                class="las la-circle dot"
                :class="[
                  passValid.upperCase === 2 && passValid.lowerCase === 2
                    ? 'green-dot'
                    : passValid.upperCase === 0 && passValid.lowerCase === 0
                    ? ''
                    : 'red-dot',
                ]"
              ></i
              >Use upper and lower case letters (e.g Aa)</span
            >
            <span
              class="validation-span"
              :class="[hideValidation ? 'hide' : 'show']"
              ><i
                class="las la-circle dot"
                :class="[
                  passValid.hasNum === 2
                    ? 'green-dot'
                    : passValid.hasNum === 1
                    ? 'red-dot'
                    : '',
                ]"
              ></i
              >Use a number (e.g 1234)</span
            >
            <span
              class="validation-span"
              :class="[hideValidation ? 'hide' : 'show']"
              ><span
                class="las la-circle dot"
                :class="[
                  passValid.hasSymbol === 2
                    ? 'green-dot'
                    : passValid.hasSymbol === 1
                    ? 'red-dot'
                    : '',
                ]"
              ></span
              >Use a symbol (e.g!@#$)</span
            >
          </div>
          <ButtonSpinner
            :is-loading="processing"
            :is-in-active="buttonDisabled"
            value="Create My Account"
            :on-submit="onSubmit"
          />
        </form>
        <footer class="auth__form-footer paragraph">
          <span class="u-text-center u-mb-30"
            >By clicking the “Create My Account” button, you agree to SenexPay’s
            <a :href="url + '/terms-of-service'" class="u-link" target="_blank"
              >terms</a
            >
            <!-- <router-link class="link-color" to="/">terms</router-link>-->
            and
            <a :href="url + '/privacy-policy'" class="u-link" target="_blank"
              >privacy</a
            >
            .</span
          >
          <span class="u-text-center"
            >Already have an account?
            <router-link class="u-link" to="/signin">Sign in</router-link></span
          >
        </footer>
      </div>
    </div>
  </div>
</template>
<script>
import getDeviceInfo from '@/data/getDeviceInfo.js'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
export default {
  layout: 'toast',
  components: {
    vSelect,
  },
  props: {
    verifyUser: {
      type: Function,
      default: () => {
        // console.log('Not verified user.')
      },
    },
    saveEmail: {
      type: Function,
      default: () => {
        // console.log('No email to use.')
      },
    },
  },
  data() {
    return {
      password: '',
      rePassword: '',
      email: '',
      firstName: '',
      lastName: '',
      mobile: '',
      mobileSuffix: '',
      countryCode: '+234',
      emailSubscription: true,
      terms: true,
      processing: false,
      passwordLocked: 'password',
      buttonDisabled: true,
      fingerPrint: '',
      validFirstName: 0,
      validLastName: 0,
      validEmail: 0,
      validMobile: 0,
      hideValidation: true,
      url: '',
      passValid: {
        charLen: 0,
        upperCase: 0,
        lowerCase: 0,
        hasNum: 0,
        hasSymbol: 0,
      },
      isVerified: false,
      countries: [
        {
          value: '+234',
          text: 'Nigeria +234',
        },
        {
          value: '+27',
          text: 'South Africa +27',
        },
      ],
    }
  },
  head() {
    return {
      script: [
        {
          src: '/client.min.js',
        },
      ],
    }
  },
  watch: {
    email(value) {
      this.email = value
      this.validateEmail(value)
    },
    password(value) {
      this.password = value
      this.validateFullPassword(value)
    },
    buttonDisabled(value) {
      this.buttonDisabled = value
    },
    mobileSuffix(value) {
      this.mobileSuffix = value
      this.validateMobile(value)
    },
    firstName(value) {
      this.firstName = value
      this.validateFirstName(value)
    },
    lastName(value) {
      this.lastName = value
      this.validateLastName(value)
    },
    countryCode(value) {
      this.countryCode = value
      this.mobileSuffix = ''
    },
  },
  mounted() {
    this.url = process.env.SENEX_LANDING_SITE_URL
  },
  methods: {
    onSelectCountry({name, iso2, dialCode}){
      this.countryCode = `+${dialCode}`
      this.mobileSuffix = ''
    },
    togglePassword() {
      this.passwordLocked =
        this.passwordLocked === 'password' ? 'text' : 'password'
    },
    validateEmail(value) {
      const reg =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/
      if (reg.test(value)) {
        this.validEmail = 2
      } else {
        this.validEmail = 1
      }
      this.isAllValid()
    },
    validatePassword(value) {
      if (this.hideValidation === true) {
        this.hideValidation = false
      }
      if (value.length < 8) {
        this.validPassword = 1
      } else {
        this.validPassword = 2
      }
      this.isAllValid()
    },
    validateMobile(value) {
      if (this.countryCode === '+234' && value.length === 10) {
        this.mobile = '+234' + value
        this.validMobile = 2
      } else if (this.countryCode === '+27' && value.length === 9) {
        this.mobile = '+27' + value
        this.validMobile = 2
      } else if (value.length <= 10) {
        this.mobile = this.countryCode + value
        this.validMobile = 2
      } else {
        this.validMobile = 1
      }
      this.isAllValid()
    },
    validateFirstName(value) {
      if (value.length < 2) {
        this.validFirstName = 1
      } else {
        this.validFirstName = 2
      }
      this.isAllValid()
    },
    validateLastName(value) {
      if (value.length < 2) {
        this.validLastName = 1
      } else {
        this.validLastName = 2
      }
      this.isAllValid()
    },
    validateFullPassword(value) {
      if (value.length === 0) {
        this.hideValidation = true
      } else {
        this.hideValidation = false
      }
      if (/[a-z]/.test(value)) {
        this.passValid.lowerCase = 2
      } else {
        this.passValid.lowerCase = 1
      }
      if (/[A-Z]/.test(value)) {
        this.passValid.upperCase = 2
      } else {
        this.passValid.upperCase = 1
      }
      if (/[ !@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g.test(value)) {
        this.passValid.hasSymbol = 2
      } else {
        this.passValid.hasSymbol = 1
      }
      if (/\d/.test(value)) {
        this.passValid.hasNum = 2
      } else {
        this.passValid.hasNum = 1
      }
      if (value.length < 8) {
        this.passValid.charLen = 1
      } else {
        this.passValid.charLen = 2
      }
      this.isAllValid()
    },
    isAllValid() {
      if (this.mobileSuffix[0] === '0') {
        this.mobileSuffix = this.mobileSuffix.slice(1)
      }
      if (
        this.validEmail === 2 &&
        this.validMobile === 2 &&
        this.validFirstName === 2 &&
        this.validLastName === 2 &&
        this.passValid.charLen === 2 &&
        this.passValid.upperCase === 2 &&
        this.passValid.lowerCase === 2 &&
        this.passValid.hasNum === 2 &&
        this.passValid.hasSymbol === 2
      ) {
        this.buttonDisabled = false
      } else {
        this.buttonDisabled = true
      }
    },
    isNumber(evt) {
      if (this.countryCode === '+234' && this.mobileSuffix.length === 10) {
        evt.preventDefault()
      } else if (this.countryCode === '+27' && this.mobileSuffix.length === 9) {
        evt.preventDefault()
      }
      const charCode = evt.which ? evt.which : evt.keyCode
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        evt.preventDefault()
      }
    },
    onSubmit() {
      this.registerUser()
    },
    async registerUser() {
      // const client = new window.ClientJS()
      // const fingerPrint = client.getFingerprint()
      // console.log(fingerPrint)
      if (this.buttonDisabled) {
        return
      }
      const payload = {
        first_name: this.firstName,
        last_name: this.lastName,
        email: this.email,
        mobile: this.mobile,
        password: this.password,
        email_subscription: this.emailSubscription,
        device: await getDeviceInfo(this.email),
        referral_id: '',
      }
      this.processing = true
      try {
        const { data } = await this.$api.register(payload)
        this.processing = false
        this.$notify({
          title: 'Welcome to SenexPay👋 ',
          text: 'Congratulations, your account was created successfully.',
        })
        // this.$toast.open({
        //   message:
        //     'Welcome to SenexPay👋  \n Congratulations, you account was created successfully.',
        //   type: 'success',
        //   position: 'top-right'
        // })
        this.saveEmail(this.email)
        this.verifyUser()
        this.firstName = ''
        this.lastName = ''
        // this.email = ''
        this.mobile = ''
        this.password = ''
        this.rePassword = ''
        this.emailSubscription = false
        // this.terms = false
        // this.$router.push('/activate')
      } catch (e) {
        this.processing = false
        const errors = e.response.data
        let error = ''
        for (const i in errors) {
          error += errors[i][0] + '. '
        }
        this.$notify({
          type: 'error',
          text: error,
        })
        // this.$toast.open({
        //   message: error,
        //   type: 'error',
        //   position: 'top-right'
        // })
      }
    },
    getDeviceInfo() {
      const client = new window.ClientJS()

      return {
        userAgent: client.getUserAgent(),
        browser: client.getBrowser(),
        os: client.getOS(),
        device: client.getDevice(),
        deviceType: client.getDeviceType(),
        deviceVendor: client.getDeviceVendor(),
        cpu: client.getCPU(),
        fingerprint: '' + client.getFingerprint(),
        timezone: client.getTimeZone(),
        language: client.getLanguage(),
      }
    },
  },
}
</script>

<style lang="scss">
.sign-up {
  .vs--unsearchable .vs__dropdown-toggle {
    width: 75px;
    height: 100%;
    padding: 0;
    margin-right: 5px;
    border: 1px solid #707070;

    .vs__selected {
      height: 100%;
      margin: 0;
    }

    input {
      display: none;
    }
  }
  .select-input {
    display: flex;
    width: 100%;
    height: 50px;
  }

  .active-color {
    opacity: 1;
    cursor: pointer;
  }

  .select-input > select {
    border: 1px solid #707070;
    margin-right: 8px;
    border-radius: 6px;
    color: #000000;
    text-align: center;
    padding: 0 10px;
  }

  .select-box {
    border: 1px solid #707070;
    margin-right: 8px;
    border-radius: 6px;
    color: #000000;
    text-align: center;
    background-color: white !important;
  }

  .validation-span {
    margin: 10px 0 0 5px;
    font-style: italic;
    color: #707070;
    display: inline-block;
  }

  .dot {
    display: inline-block;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    margin-right: 2px;
    border: 1px solid #707070;
    position: relative;
    border-radius: 50%;
    font-size: 6px;
  }

  .red-dot {
    background-color: red;
  }
  .green-dot {
    background-color: green;
  }
  .hide {
    display: none;
  }

  .show {
    display: block;
  }

  .link-color {
    color: #076de2;
  }

  .use-active {
    color: #076de2;
    font-size: 14px;
  }

  // /deep/ #dropdown-menu > button {
  //   // width: 100%;
  //   height: 100%;
  //   background-color: white;
  //   color: black;
  //   margin-right: 10px;
  //   width: 70px;
  // }

  // /deep/ #dropdown-menu__BV_toggle_ {
  //   width: 100%;
  //   border: 1px solid #707070;
  //   margin-right: 10px;
  // }

  // /deep/ .dropdown-menu {
  //   border: 1px solid #707070;
  //   margin-top: 5px;
  // }
}
</style>
