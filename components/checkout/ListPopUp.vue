<template>
  <div class="pop-up-overlay" :class="open ? 'pop-up-overlay--visible' : ''">
    <div class="pop-up">
      <div class="pop-up__header">
        <span class="pop-up__close" @click="close()"
          ><img src="/img/close.svg" alt="close"
        /></span>
        <h3 class="pop-up__title paragraph">Banks</h3>
      </div>
      <div class="pop-up__body">
        <div class="pop-up__search-box">
          <input
            v-model="search"
            type="text"
            class="pop-up__input"
            placeholder="Search bank name"
            autocomplete="off"
          />
          <img src="/img/search-grey.svg" alt="eye" class="pop-up__input-img" />
        </div>
        <div class="pop-up__list-box">
          <span
            class="pop-up__list-item u-text-uppercase"
            v-for="(item, idx) in filterList()"
            :key="idx"
            @click="selectItem(item)"
            >{{ item.label }}</span
          >
          <!-- <span class="pop-up__list-item">First Bank</span> -->
        </div>
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
    filterList() {
      return this.list
        .filter((x) =>
          x.label.toLowerCase().includes(this.search.toLowerCase())
        )
        .sort((a, b) => a.label.localeCompare(b.label))
    },
    selectItem(item) {
      // this.$emit('select-item', item)
      this.$store.commit('order/selectBank', item)
      this.close()
    },
  },
}
</script>

<style></style>
