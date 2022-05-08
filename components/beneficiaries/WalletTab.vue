<template>
  <div class="txn-tab">
    <div class="txn-tab__header u-my-30">
      <div class="txn-tab__search-box">
        <img
          src="img/search-grey.svg"
          alt="search"
          class="txn-tab__search-icon"
        />
        <input
          v-model="search"
          type="text"
          class="txn-tab__search-input"
          placeholder="Search"
        />
      </div>
      <div class="txn-tab__page-box">
        <button class="btn u-mr-20" @click="showModal = true">
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
    <wallet-table
      :wallets="walletsToShow()"
      @editOrDelete="editOrDelete"
    ></wallet-table>
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
              {{ mode == 'add' ? 'Add' : 'Edit' }} Wallet
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
              >
                <template #option="{ label }">
                  <div style="display: flex; justify-content: space-between">
                    <span>{{ label }}</span>
                    <span class="flag-box">
                      <img
                        :src="`img/crypto/${label.toLowerCase()}.svg`"
                        alt="currency-icon"
                        class="flag"
                      />
                    </span>
                  </div>
                </template>
              </v-select>
            </div>
            <div class="form__input-box u-mb-20">
              <input
                type="text"
                v-model="walletAddress"
                placeholder="Enter wallet address"
              />
              <span
                class="form__input-extra u-pointer"
                v-tooltip="{
                  content:
                    'Please ensure you paste the correct wallet address.',
                  placement: 'right',
                }"
              >
                <img src="img/icons/info_white_round_icon.svg" alt="info" />
              </span>
            </div>
            <div class="form__input-box u-mb-20">
              <input type="text" v-model="label" placeholder="Enter nickname" />
            </div>
            <BtnSpinner
              :is-loading="processing"
              :is-in-active="isBtnDisabled()"
              value="Add Wallet"
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
      search: '',
      showModal: false,
      currentPage: 1,
      perPage: 5,
      totalPages: 1,
      mode: 'add',
      bank: {
        value: '',
        label: '',
      },
      currency: '',
      walletId: '',
      label: '',
      walletAddress: '',
      processing: false,
    }
  },
  watch: {
    user(val) {
      if (val && val.profile.walletAddresses) {
        this.totalPages =
          parseInt((val.profile.walletAddresses.length - 1) / this.perPage) + 1
      }
      this.totalPages = 1
    },
  },
  computed: {
    ...mapState('auth', ['user']),
  },
  methods: {
    getCurrencies() {
      return ['BTC', 'USDT']
    },
    changeCurrentPage(page) {
      if (page < 1 || page > this.totalPages) {
        return
      }
      this.currentPage = page
    },
    walletsToShow() {
      return this.getWallets().slice(
        (this.currentPage - 1) * this.perPage,
        this.currentPage * this.perPage
      )
    },
    getWallets() {
      if (this.user && this.user.profile.walletAddresses) {
        return this.user.profile.walletAddresses.data
          ? this.user.profile.walletAddresses.data
          : []
      }
      return []
    },
    add() {
      this.mode = 'add'
      this.showModal = true
      this.currency = ''
      this.walletAddress = ''
      this.label = ''
      this.walletId = ''
    },
    editOrDelete(mode, id) {
      this.mode = mode
      this.walletId = id
      let selectedWallet = this.getWallets().find((wallet) => wallet.id === id)
      this.currency = selectedWallet.currency
      this.walletAddress = selectedWallet.walletAddress
      this.label = selectedWallet.label
      if (mode == 'edit') {
        this.showModal = true
      } else {
        this.onSubmit()
      }
    },
    onSelectCurrency() {
      this.walletAddress = ''
      this.label = ''
    },
    async onSubmit() {
      let userWallets = this.user.profile.walletAddresses.data
        ? [...this.user.profile.walletAddresses.data]
        : []
      if (this.mode !== 'add') {
        userWallets = userWallets.filter((item) => item.id !== this.walletId)
      }
      if (this.mode !== 'delete') {
        userWallets.push({
          id: Date.now(),
          currency: this.currency,
          label: this.label,
          walletAddress: this.walletAddress,
        })
      }
      const payload = {
        walletAddresses: { data: userWallets },
      }
      this.processing = true
      try {
        const { data } = await this.$api.updateProfile(payload)
        await this.$auth.fetchUser()
        this.$notify({
          text: 'Wallet added',
          type: 'success',
        })
        this.currency = ''
        this.label = ''
        this.walletAddress = ''
        this.processing = false
      } catch (error) {
        this.processing = false
        this.$notify({
          text: 'Unable to add wallet',
          type: 'error',
        })
      } finally {
        this.showModal = false
      }
    },
    isBtnDisabled() {
      return !this.walletAddress || !this.label || !this.currency
    },
  },
}
</script>

<style lang="scss">
.flag-box {
  width: 20px;
  height: 20px;
}
.flag {
  width: 100% !important;
  height: 100% !important;
}

.tooltip {
  display: block !important;
  z-index: 10000;

  .tooltip-inner {
    background: #fff;
    color: #000;
    border-radius: 6px;
    padding: 8px;
    width: 150px;
  }

  .tooltip-arrow {
    width: 0;
    height: 0;
    border-style: solid;
    position: absolute;
    margin: 5px;
    border-color: #fff;
    z-index: 1;
  }

  &[x-placement^='top'] {
    margin-bottom: 5px;

    .tooltip-arrow {
      border-width: 5px 5px 0 5px;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      border-bottom-color: transparent !important;
      bottom: -5px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  &[x-placement^='bottom'] {
    margin-top: 5px;

    .tooltip-arrow {
      border-width: 0 5px 5px 5px;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      border-top-color: transparent !important;
      top: -5px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  &[x-placement^='right'] {
    margin-left: 5px;

    .tooltip-arrow {
      border-width: 5px 5px 5px 0;
      border-left-color: transparent !important;
      border-top-color: transparent !important;
      border-bottom-color: transparent !important;
      left: -5px;
      top: calc(50% - 5px);
      margin-left: 0;
      margin-right: 0;
    }
  }

  &[x-placement^='left'] {
    margin-right: 5px;

    .tooltip-arrow {
      border-width: 5px 0 5px 5px;
      border-top-color: transparent !important;
      border-right-color: transparent !important;
      border-bottom-color: transparent !important;
      right: -5px;
      top: calc(50% - 5px);
      margin-left: 0;
      margin-right: 0;
    }
  }

  &.popover {
    $color: #f9f9f9;

    .popover-inner {
      background: $color;
      color: black;
      padding: 24px;
      border-radius: 5px;
      box-shadow: 0 5px 30px rgba(black, 0.1);
    }

    .popover-arrow {
      border-color: $color;
    }
  }

  &[aria-hidden='true'] {
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.15s, visibility 0.15s;
  }

  &[aria-hidden='false'] {
    visibility: visible;
    opacity: 1;
    transition: opacity 0.15s;
  }
}
</style>
