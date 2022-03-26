<template>
  <div class="tab-holder">
    <div class="tab-list">
      <div class="tab-list__box">
        <div
          v-for="(tab, index) in tabs"
          :key="index"
          class="tab-list__item"
          @click="onSelect(tab)"
        >
          {{ tab.title }}
        </div>
        <span
          class="tab-list__glider"
          :class="`tab-list__glider--${currentTabIdx() + 1}`"
        ></span>
      </div>
    </div>
    <div>
      <component
        :is="currentTab.component"
        v-bind="currentTab.properties"
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
    }
  },
  methods: {
    onSelect(tab) {
      this.currentTab = tab
    },
    currentTabIdx() {
      return this.tabs.findIndex((tab) => tab.title === this.currentTab.title)
    },
  },
}
</script>

<style></style>
