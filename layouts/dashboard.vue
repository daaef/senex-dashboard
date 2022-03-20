<template>
  <div class="dashboard">
    <div class="dashboard__side-menu">
      <SideMenu />
    </div>
    <div class="dashboard__topbar">
      <TopBar />
    </div>
    <div class="dashboard__main">
      <div class="container">
        <div class="dashboard__content">
          <Nuxt />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style></style>
