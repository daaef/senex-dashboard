<template>
  <div>
    <LoadingState v-if="loading" page-height="100vh" />
    <div v-else>
      <EmailSuccess v-if="emailVerified" />
      <EmailFailed v-else />
    </div>
  </div>
</template>
<script>
// import CardTitle from '@/components/Base/Card/CardTitle'
export default {
  components: {
  },
  layout: 'blank',
  head() {
    return {
      title: 'Activation | SenexPay',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Activate your SenexPay password',
        },
      ],
    }
  },
  data() {
    return {
      opacity: 1,
      processing: true,
      loading: true,
      emailVerified: false,
    }
  },
  mounted() {
    this.verifyEmail()
  },
  methods: {
    login() {
      this.$router.push('/signin')
    },
    async verifyEmail() {
      const payload = {
        uid: this.$route.params.id,
        token: this.$route.params.token,
      }
      this.processing = true
      try {
        await this.$api.activate(payload)
        this.processing = false
        this.emailVerified = true
        this.loading = false
      } catch (error) {
        this.processing = false
        this.emailVerified = false
        this.loading = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.main-activate-id-div {
  background-color: #053888;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  padding: 0 18px;
  font-family: 'SFProRegular';
  color: #222122;
}

.holder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 460px;
  width: 100%;
  margin: auto;
}

.card-holder {
  width: 100%;
  padding: 20px;
  background-color: white;
  border-radius: 6px;
}

.icon {
  margin: auto;
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

#logo {
  height: 40px;
}

.c-header {
  display: inline-block;
  width: 100%;
  text-align: center;
  margin: 20px 0;
  font-size: 20px;
  font-family: 'SFProSemiBold';
}

.img-wrapper {
  width: 100px;
  margin: auto;
}

.image {
  width: 100%;
  height: auto;
}

.sent-email {
  display: block;
  width: 100%;
  margin: 10px auto 20px auto;
  text-align: center;
}

.prom-folder {
  display: block;
  width: 100%;
  margin: 10px auto 20px auto;
  text-align: center;
  color: #707070;
}
.submit-btn-holder {
  width: 100%;
  margin: auto;
  height: 50px;
  margin-bottom: 20px;
  font-size: 20px;
}

.submit-btn {
  background-color: #0b913a;
  color: #ffffff;
  width: 100%;
  height: 100%;
  border-radius: 5px;
  border: 1px solid;
  cursor: pointer;
}

@media screen and (min-width: 450px) {
  .card-holder {
    padding: 40px;
  }
}
</style>
