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
          title: 'Invite A Friend',
          component: 'InviteFriendTab',
          properties: {
            showHeader: false,
            btnText: 'Add Wallet',
          },
        },
        {
          title: 'Earnings',
          component: 'NextOfKinTab',
          properties: {
            showHeader: false,
            btnText: 'Add Bank Account',
          },
        },
      ],
    }
  },
}
</script>

<style></style>
