<template>
  <div class="tab-holder">
    <div class="tab-list">
      <div class="tab-list__box">
        <div
          v-for="(tab, index) in tabs"
          :key="index"
          class="tab-list__item"
          @click="onSelect(tab, index)"
        >
          {{ tab.title }}
        </div>
        <span
          class="tab-list__glider"
          :class="`tab-list__glider--${currentTabIndex + 1}`"
        ></span>
      </div>
    </div>
    <div class="tab-drop">
      <p class="tab-drop__title-con" @click="toggleOpen">
        <span class="title">{{ currentTab.title }}</span>
        <span class="arrow-con" :class="[dropOpen ? 'rotate-up' : '']"
          ><img src="/img/awesome-arrow-down-white.svg" alt="down arrow"
        /></span>
      </p>
      <div class="tab-drop__content" :class="[dropOpen ? '' : 'u-none']">
        <p
          class="tab-drop__item"
          v-for="(tab, idx) in tabs"
          :key="idx"
          @click="
            () => {
              onSelect(tab, idx)
              dropOpen = false
            }
          "
        >
          {{ tab.title }}
        </p>
      </div>
    </div>
    <div>
      <component
        :is="currentTab.component"
        v-bind="currentTab.properties"
        :key="currentTabIndex"
      ></component>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tabs: {
      type: Array,
      default: () => [
        {
          title: '',
          component: '',
          properties: {},
        },
      ],
    },
  },
  data() {
    return {
      // :class="[network == selected ? 'tab-list__select-btn--active' : '', `ntw-switch__select-btn--${tabs(items).length}`]"
      currentTab: this.tabs[0],
      currentTabIndex: 0,
      dropOpen: false,
    }
  },
  methods: {
    onSelect(tab, index) {
      // const isSameTabName = this.currentTab.component === tab.component
      this.currentTab = tab
      this.currentTabIndex = index
    },
    currentTabIdx() {
      return this.tabs.findIndex((tab) => tab.title === this.currentTab.title)
    },
    toggleOpen() {
      this.dropOpen = !this.dropOpen
    },
  },
}
</script>

<style></style>
