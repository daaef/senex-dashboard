<template>
  <div class="txn-tab">
    <div class="txn-tab__header u-my-30">
      <div class="txn-tab__search-box">
        <img src="h.png" alt="" class="txn-tab__search-icon" />
        <input type="text" class="txn-tab__search-input" placeholder="Search" />
      </div>
      <div class="txn-tab__page-box">
        <button class="btn u-mr-20" @click="add">
          {{ btnText }}
        </button>
        <span>{{ currentPage }} - {{ perPage }} of {{ totalPages }}</span>
        <div class="txn-tab__arrow-box">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="11.115"
            height="18"
            viewBox="0 0 11.115 18"
            class="icon"
            @click="changeCurrentPage(currentPage - 1)"
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
            @click="changeCurrentPage(currentPage + 1)"
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
    <bank-account-table
      :bankAccounts="bankAccountsToShow()"
      @editOrDelete="editOrDelete"
    ></bank-account-table>
    <vue-final-modal v-model="showModal">
      <div class="benef-overlay container">
        <form class="form">
          <div class="form__header">
            <img
              class="close"
              src="/img/icons/close_round_modal_icon.svg"
              alt="close"
              @click="showModal = false"
            />
            <h3 class="heading-primary u-text-center u-mx-auto">
              {{ mode == 'add' ? 'Add' : 'Edit' }} Bank Account
            </h3>
          </div>
          <div class="form__body">
            <div class="u-mb-20">
              <v-select
                :options="getCurrencies()"
                v-model="currency"
                :clearable="false"
                :searchable="false"
                placeholder="Select your currency"
                @option:selected="onSelectCurrency"
              >
                <template #option="{ label }">
                  <div
                    style="
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                    "
                  >
                    <span>{{ label }}</span>
                    <span class="flag-box">
                      <img
                        :src="flagByCurrency(label)"
                        alt="currency-icon"
                        class="flag"
                      />
                    </span>
                  </div>
                </template>
              </v-select>
            </div>
            <div class="u-mb-20">
              <v-select
                :options="getCountryBanks()"
                :clearable="false"
                :searchable="false"
                v-model="bank"
                label="label"
                placeholder="Select your bank"
              ></v-select>
            </div>
            <div class="form__input-box u-mb-20">
              <input
                type="text"
                v-model="accountNumber"
                placeholder="Enter your account number"
                @keypress="isNumber"
              />
            </div>
            <div class="form__input-box u-mb-20">
              <input
                type="text"
                v-model="accountName"
                placeholder="Enter your account name"
              />
            </div>
            <BtnSpinner
              :is-loading="processing"
              :is-in-active="isBtnDisabled()"
              value="Add Bank Account"
              set-class="btn-full-width btn--px2py1"
              :on-submit="onSubmit"
            />
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
import banks from '@/data/allBanks.js'
import flags from '@/data/flags.js'
import { countries } from 'countries-list'
const accountNotFound = 'Account not found'
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
      banks: banks,
      showModal: false,
      currentPage: 1,
      perPage: 5,
      totalPages: 1,
      mode: 'add',
      bank: {
        value: '',
        label: 'Select your bank',
      },
      currency: '',
      accountId: '',
      accountNumber: '',
      accountName: '',
      accountVerified: false,
      processing: false,
      verifyingAccount: false,
      flags: flags,
    }
  },
  watch: {
    user(val) {
      if (val && val.profile.bankAccounts) {
        this.totalPages =
          parseInt((val.profile.bankAccounts.length - 1) / this.perPage) + 1
      }
      this.totalPages = 1
    },
    bank(val) {
      if (
        this.currency !== 'NGN' ||
        !val.value ||
        this.accountNumber.length < 10
      ) {
        this.accountName = ''
        return
      }
      this.accountVerification()
    },
    accountNumber(val) {
      if (this.currency === 'NGN' && val.length != 10) {
        this.accountName = ''
        return
      }
      if (this.currency !== 'NGN' || !this.bank.value) {
        this.accountName = ''
        return
      }
      if (this.bank && this.bank.value && this.accountNumber.length === 10) {
        this.accountVerification()
      }
    },
  },
  computed: {
    ...mapState('auth', ['user']),
  },
  methods: {
    getCurrencies() {
      return Object.keys(this.banks)
    },
    getCountryBanks() {
      if (this.currency) {
        return this.banks[this.currency]
      }
      return []
    },
    changeCurrentPage(page) {
      if (page < 1 || page > this.totalPages) {
        return
      }
      this.currentPage = page
    },
    bankAccountsToShow() {
      return this.getBankAccounts().slice(
        (this.currentPage - 1) * this.perPage,
        this.currentPage * this.perPage
      )
    },
    getBankAccounts() {
      if (this.user && this.user.profile.bankAccounts) {
        return this.user.profile.bankAccounts.data
          ? this.user.profile.bankAccounts.data
          : []
      }
      return []
    },
    async accountVerification() {
      this.verifyingAccount = true
      try {
        const { data } = await this.$axios.post(
          `${process.env.FLW_BASE_URL}/flwv3-pug/getpaidx/api/resolve_account`,
          {
            recipientaccount: this.accountNumber,
            destbankcode: this.bank.value,
            PBFPubKey: process.env.FLW_PUB_KEY,
          }
        )
        if (data.data.data.accountname) {
          this.accountName = data.data.data.accountname
          this.accountVerified = true
        } else {
          this.accountName = accountNotFound
          this.accountVerified = false
        }
      } catch (error) {
        this.accountVerified = false
      } finally {
        this.verifyingAccount = false
      }
    },
    add() {
      this.mode = 'add'
      this.showModal = true
      this.currency = ''
      this.accountNumber = ''
      this.accountName = ''
      this.bank = {
        value: '',
        label: 'Select your bank',
      }
    },
    editOrDelete(mode, id) {
      this.mode = mode
      this.accountId = id
      let selectedBank = this.getBankAccounts().find((bank) => bank.id === id)
      this.currency = selectedBank.currency
      this.accountNumber = selectedBank.accountNumber
      this.accountName = selectedBank.accountName
      this.bank = {
        value: selectedBank.bank,
        label: selectedBank.bankName,
      }
      if (mode == 'edit') {
        this.showModal = true
      } else {
        this.onSubmit()
      }
    },
    onSelectCurrency() {
      this.bank = {
        value: '',
        label: 'Select your bank',
      }
      this.accountName = ''
    },
    async onSubmit() {
      let userAccounts = this.user.profile.bankAccounts.data
        ? [...this.user.profile.bankAccounts.data]
        : []
      if (this.mode !== 'add') {
        userAccounts = userAccounts.filter((item) => item.id !== this.accountId)
      }
      if (this.mode !== 'delete') {
        userAccounts.push({
          id: Date.now(),
          account_number: this.accountNumber,
          account_name: this.accountName,
          bank: this.bank.value,
          bank_name: this.bank.label,
          currency: this.currency,
        })
      }
      const payload = {
        bankAccounts: { data: userAccounts },
      }
      this.processing = true
      try {
        const { data } = await this.$api.updateProfile(payload)
        await this.$auth.fetchUser()
        this.$notify({
          text: 'Bank account added',
        })
        this.bank = {
          value: '',
          label: 'Select your bank',
        }
        this.accountNumber = ''
        this.currency = ''
        this.processing = false
      } catch (error) {
        this.processing = false
        this.$notify({
          text: 'Unable to add account',
          type: 'error',
        })
      } finally {
        this.showModal = false
      }
    },
    isNumber(evt) {
      if (this.currency === 'NGN' && this.accountNumber.length === 10) {
        evt.preventDefault()
      }
      const charCode = evt.which ? evt.which : evt.keyCode
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        evt.preventDefault()
      }
    },
    isBtnDisabled() {
      return (
        !this.bank.value ||
        !this.accountNumber ||
        !this.accountName ||
        this.accountName === accountNotFound ||
        !this.currency
      )
    },
    flagByCurrency(currency) {
      for (const country in countries) {
        const currencyList = countries[country].currency.split(',')
        if (currencyList[0] == currency) {
          return flags(country.toLowerCase())
        }
      }
    },
  },
}
</script>

<style scoped>
.flag-box {
  width: 20px;
  height: 15px;
}
.flag {
  width: 100% !important;
  height: 100% !important;
  border-radius: 50%;
  object-fit: cover !important;
}
</style>
