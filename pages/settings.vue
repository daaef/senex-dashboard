<template>
  <div>
    <tab-holder :tabs="tabs"></tab-holder>
  </div>
</template>

<script>
export default {
  layout: 'dashboard',
  // middleware: 'authenticated',
  head() {
    return {
      title: 'Settings | SenexPay ',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Your SenexPay settings page.',
        },
      ],
    }
  },
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
