<template>
  <div>
    <tab-holder :tabs="tabs"></tab-holder>
  </div>
</template>

<script>
export default {
  layout: 'dashboard',
  middleware: 'authenticated',
  data() {
    return {
      tabs: [
        {
          title: 'Password',
          component: 'PasswordTab',
          properties: {
            showHeader: false,
          },
        },
        {
          title: 'Security Key',
          component: 'SecurityKeyTab',
          properties: {
            showHeader: false,
          },
        },
      ],
    }
  },
}
</script>

<style></style>
