<template>
  <div class="txn-tab">
    <div class="txn-tab__header u-my-30">
      <div class="txn-tab__search-box">
        <img src="h.png" alt="" class="txn-tab__search-icon" />
        <input type="text" class="txn-tab__search-input" placeholder="Search" />
      </div>
      <div class="txn-tab__page-box">
        <button class="btn u-mr-20" @click="showModal = true">
          {{ btnText }}
        </button>
        <span>1-16 of 16</span>
        <div class="txn-tab__arrow-box">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="11.115"
            height="18"
            viewBox="0 0 11.115 18"
            class="icon"
          >
            <path
              id="Icon_material-navigate-next"
              data-name="Icon material-navigate-next"
              d="M21.885,9,24,11.115,17.13,18,24,24.885,21.885,27l-9-9Z"
              transform="translate(-12.885 -9)"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="11.115"
            height="18"
            viewBox="0 0 11.115 18"
            class="icon"
          >
            <path
              id="Icon_material-navigate-next"
              data-name="Icon material-navigate-next"
              d="M15,9l-2.115,2.115L19.755,18l-6.87,6.885L15,27l9-9Z"
              transform="translate(-12.885 -9)"
            />
          </svg>
        </div>
      </div>
    </div>
    <bank-account-table :bankAccounts="getBankAccounts()"></bank-account-table>
    <vue-final-modal v-model="showModal">
      <div class="benef-overlay">
        <form class="form">
          <div class="form__header">
            <span class="close" @click="showModal = false"></span>
            <h3 class="heading-primary u-text-center u-mx-auto">
              Add Bank Account
            </h3>
          </div>
          <div class="form__body">
            <div class="u-mb-20">
              <v-select
                :options="['NGN', 'ZAR']"
                :clearable="false"
                :searchable="false"
                placeholder="Select your currency"
              ></v-select>
            </div>
            <div class="u-mb-20">
              <v-select
                :options="['Access Bank', 'GTBank', 'UBA', 'Zenith Bank']"
                :clearable="false"
                :searchable="false"
                placeholder="Select your bank"
              ></v-select>
            </div>
            <div class="form__input-box u-mb-20">
              <input type="text" placeholder="Enter your account number" />
            </div>
            <div class="form__input-box">
              <input type="text" placeholder="Enter your account name" />
            </div>
          </div>
        </form>
      </div>
    </vue-final-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
export default {
  components: {
    vSelect,
  },
  props: {
    btnText: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      showModal: false,
    }
  },
  computed: {
    ...mapState('auth', ['user']),
  },
  methods: {
    getBankAccounts() {
      if (this.user && this.user.profile.bankAccounts) {
        return this.user.profile.bankAccounts.data
      }
      return []
    },
  },
}
</script>

<style></style>
