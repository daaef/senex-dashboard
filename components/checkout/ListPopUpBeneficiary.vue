<template>
  <div class="pop-up-overlay" :class="open ? 'pop-up-overlay--visible' : ''">
    <div class="pop-up">
      <div class="pop-up__header">
        <span class="pop-up__close" @click="close()"
          ><img src="/img/close.svg" alt="close"
        /></span>
        <h3 class="pop-up__title paragraph">Your Beneficiaries</h3>
      </div>
      <div class="pop-up__body" v-if="list.length > 0">
        <div class="pop-up__search-box">
          <input
            v-model="search"
            type="text"
            class="pop-up__input"
            placeholder="Search beneficiary"
            autocomplete="off"
          />
          <img src="/img/search-grey.svg" alt="eye" class="pop-up__input-img" />
        </div>
        <div class="pop-up__list-box">
          <div
            class="pop-up__list-item"
            v-for="(item, idx) in filterList()"
            :key="idx"
            @click="selectItem(item)"
          >
            <span v-if="isBuying">{{ item.label }}</span>
            <span :class="isBuying ? 'grey' : ''">{{
              isBuying ? item.walletAddress : item.accountName
            }}</span>
            <span v-if="!isBuying" class="grey"
              >({{ item.accountNumber }} {{ item.bankName }})</span
            >
          </div>
          <!-- <span class="pop-up__list-item">First Bank</span> -->
        </div>
      </div>
      <div v-else class="b-not-found">
        <img src="/img/beneficiary-empty.svg" alt="not found" class="u-mb-20" />
        <span class="paragraph paragraph--700 u-mb-10">Kinda Quiet Here</span>
        <span class="paragraph u-mb-20"
          >You have not saved any beneficiary</span
        >

        <button class="b-not-found__btn u-mb-20" @click="addBeneficiary">
          Add a beneficiary
        </button>
        <span class="paragraph b-not-found__cancel" @click="close()"
          >Cancel</span
        >
      </div>
    </div>
  </div>
</template>

<script>
// import banks from '@/data/banks.js'
export default {
  data() {
    return {
      // banks: banks.sort((a, b) => a.label.localeCompare(b.label)),
      search: '',
    }
  },
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    isBuying: {
      type: Boolean,
      default: true,
    },
    list: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    close() {
      // this.$emit('control-pop-up', false)
      this.$store.commit('order/setOpenList', false)
    },
    addBeneficiary() {
      this.close()
      this.$emit('addNewBeneficiary')
    },
    filterList() {
      if (this.isBuying) {
        return this.list
          .filter((x) =>
            x.walletAddress.toLowerCase().includes(this.search.toLowerCase())
          )
          .sort((a, b) => a.walletAddress.localeCompare(b.walletAddress))
      } else {
        return this.list
          .filter((x) =>
            x.accountName.toLowerCase().includes(this.search.toLowerCase())
          )
          .sort((a, b) => a.accountName.localeCompare(b.accountName))
      }
    },
    selectItem(item) {
      if (this.isBuying) {
        // this.$emit('select-item', item.walletAddress)
        this.$store.commit('order/selectWallet', item)
      } else {
        this.$store.commit('order/selectBankAccount', item)
      }
      this.close()
    },
  },
}
</script>

<style lang="scss" scoped></style>
