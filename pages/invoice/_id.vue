<template>
  <div>
    <div class="">
      <div class="order-main">
        <section class="order-main__left-container">
          <div class="order-main__left-content">
            <!-- <NewInvoice :invoiceId="invoiceID()" /> -->
            <div v-if="pageLoading">
              <!-- <OrderLoadingState /> -->
              <!-- Processing Error -->
            </div>
            <div v-else-if="showReview">
              <OrderReview2
                @setShowReview="setShowReview"
                :timeLeft="getTimeLeft()"
                :order="info"
              />
            </div>
            <!-- <div v-else-if="processing"></div> -->
            <div v-else>
              <div v-if="!isEmailVerified">
                <VerifyEmailInvoice
                  :timeLeft="getTimeLeft()"
                  @setShowReview="setShowReview"
                  :invoiceId="orderID"
                  :email="info.email"
                />
              </div>
              <div v-else-if="unApprovedAccount">
                <!-- <HiddenInvoice
                  :timeLeft="getTimeLeft()"
                  @setShowReview="setShowReview"
                  :invoiceId="orderID"
                /> -->
                <CompleteKYC />
              </div>
              <div v-else-if="step == 'pay'">
                <NewInvoice
                  :deposit="deposit"
                  @emitMarkOrderPaid="emitMarkOrderPaid"
                  @setShowReview="setShowReview"
                  @emitFetchDepositDetails="emitFetchDepositDetails"
                  :invoiceId="invoiceID()"
                  :purchaseError="purchase_error"
                  :qrFallback="qrFallback"
                  :qrCode="qrCode"
                  :qrLoading="qrLoading"
                  :propProcessing="processing"
                  :networkAddress="networkAddress"
                  :usdtNetworks="usdtNetworks"
                  :activeNetwork="activeNetwork"
                  :timeLeft="getTimeLeft()"
                  @selectedNetwork="selectedNetwork"
                  :processingPaymentDetails="processingPaymentDetails"
                  @setSelectedProvider="setSelectedProvider"
                  :selectedProvider="selectedProvider"
                />
              </div>
              <div v-else-if="step == 'paid' || paid">
                <SuccessInvoice @setShowReview="setShowReview" />
              </div>
            </div>
          </div>
        </section>
        <section class="order-main__right-container">
          <div class="order-main__right-content">
            <template v-if="guideImage == 'payment1'">
              <PaymentGuide />
            </template>
            <template v-else-if="guideImage == 'green-image'">
              <img
                src="/img/bitcoin-rafiki.svg"
                alt="Bitcoin green image"
                class="invoice__guide-image"
              />
            </template>
            <template v-else-if="guideImage == 'yellow-image'">
              <img
                src="/img/bitcoin-cuate.svg"
                alt="Bitcoin yellow image"
                class="invoice__guide-image"
              />
            </template>
            <template v-else-if="guideImage == 'blue-image'">
              <img
                src="/img/bitcoin-bro-blue.svg"
                alt="Bitcoin bro blue"
                class="invoice__guide-image"
              />
            </template>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  layout: 'order',
  async asyncData({ $axios, params, store, error }) {
    try {
      const { data } = await $axios.get(`/invoice/${params.id}`)
      // console.log('data', dataMap)

      let step = 'load'
      let paid = false
      let guideImage = 'yellow-image'
      if (
        ['paid', 'disbursing', 'disbursed', 'completed'].includes(data.status)
      ) {
        // if kyc then step = paid and paid = true
        step = 'paid'
        paid = true
        guideImage = 'green-image'
      }
      store.commit('order/changeLoading', { show: true, text: 'Loading' })
      store.commit('invoice/setOrderID', params.id)
      store.commit('invoice/setInfo', data)
      store.commit('invoice/setPaid', paid)
      store.commit('invoice/setStep', step)
      store.commit('invoice/setGuideImage', guideImage)

      // this.fetchDepositDetails()
    } catch (e) {
      // console.log('error:', e)
      error({ statusCode: 404, message: 'Post not found' })
    }
  },
  head() {
    return {
      title: 'Invoice | SenexPay',
      meta: [
        {
          hid: 'SenexPay Invoice',
          name: 'Invoice - SenexPay',
          content: 'View your invoice',
        },
      ],
    }
  },
  data() {
    return {
      // orderID: '',
      // info: null,
      // paid: false,
      // step: 'load'
      isEmailVerified: false,
      unApprovedAccount: false,
      checked: false,
      loading: false,
      qrCode: null,
      qrFallback: false,
      qrLoading: false,
      activeNetwork: '',
      usdtNetworks: {},
      deposit: null,
      interval34: 0,
      purchase_error: false,
      copyText: 'Copy address',
      processing: true,
      showReview: false,
      timeLeft: 0,
      timerID: 0,
      pageLoading: true,
      markedAsPaid: false,
      networkAddress: '',
      processingPaymentDetails: false,
      selectedProvider: {},
    }
  },
  computed: {
    ...mapState({
      orderID: (state) => state.invoice.orderID,
      info: (state) => state.invoice.info,
      paid: (state) => state.invoice.paid,
      step: (state) => state.invoice.step,
      invoiceTimeLeft: (state) => state.invoice.timeLeft,
      guideImage: (state) => state.invoice.guideImage,
      instructionChecked: (state) => state.invoice.instructionChecked,
    }),
  },
  watch: {
    async activeNetwork(newVal, oldVal) {
      if (newVal !== oldVal && newVal !== '') {
        this.fetchDepositDetails()
      } else {
        this.qrCode = ''
        this.$clipboard(this.networkAddress)
      }
    },
    selectedProvider(newVal, oldVal) {
      if (newVal !== oldVal && newVal) {
        this.fetchDepositDetails()
      }
    },
    invoiceTimeLeft(val) {
      // console.log('invoiceTimeLeft', val)
      if (val <= 0 && this.step == 'pay') {
        this.$router.push('/order/start')
      }
    },
  },
  beforeMount() {
    this.terminateSession()
    this.emailCheck()
  },
  mounted() {
    const timeNow = new Date()
    const expiryTime = Date.parse(this.info.expires)
    this.timeLeft = expiryTime - timeNow.getTime()

    if (this.timeLeft <= 0 && this.step == 'pay') {
      this.$router.push('/order/start')
    }

    this.$store.dispatch('invoice/setTimeLeft', this.timeLeft)
    this.$store.commit('order/changeLoading', { show: false, text: '' })

    this.$store.commit('order/setPlaceOrder', {})
    this.$store.commit('order/setHasTriedPlacingOrder', false)
  },
  methods: {
    invoiceID() {
      return this.$route.params.id
    },
    setShowReview(val) {
      this.showReview = val
      // this.$store.commit('invoice/setGuideImage', 'blue-image')
    },
    setTimeLeft(val) {
      this.timeLeft = val
    },
    getTimeLeft() {
      // const timeNow = new Date()
      // const expiryTime = Date.parse(this.info.expires)
      // return expiryTime - timeNow.getTime()
      return this.invoiceTimeLeft
    },
    async getData() {
      try {
        const { data } = await this.$axios.get(
          `/invoice/${this.$route.params.id}`
        )

        let step = 'load'
        let paid = false
        if (
          ['paid', 'disbursing', 'disbursed', 'completed'].includes(data.status)
        ) {
          // if kyc then step = paid and paid = true
          step = 'paid'
          paid = true
        }

        this.$store.commit('invoice/setOrderID', this.$route.params.id)
        this.$store.commit('invoice/setInfo', data)
        this.$store.commit('invoice/setPaid', paid)
        this.$store.commit('invoice/setStep', step)

        this.fetchDepositDetails()
        // return { orderID: params.id, info: data, step, paid }
      } catch (e) {
        // console.log('get data error', e)
      }
    },
    async kycCheck() {
      const payload = {
        email: this.info.email,
        cryptoAmount: this.info.cryptoAmount,
        type: this.info.type,
        rate: this.info.cryptoFiatRate,
        cryptoCurrency: this.info.cryptoCurrency,
        fiatCurrency: this.info.fiatCurrency,
      }
      this.processing = true
      this.$axios
        .post('/kyc/check', payload)
        .then((res) => {
          // popup login and change mode
          this.unApprovedAccount = false
          if (this.step != 'paid') {
            this.$store.commit('invoice/setStep', 'pay')
            // this.$store.commit('invoice/setGuideImage', 'payment1')
            this.$store.commit('invoice/setGuideImage', 'yellow-image')
          }
          this.processing = false
        })
        .catch((err) => {
          const {
            response: { data, status },
          } = err

          if (status === 400) {
            if (data.isUser) {
              this.errorMessage = data.message
              if (
                data.message &&
                data.message.includes('account is yet to be activated')
              ) {
                this.isEmailVerified = false
              } else if (
                data.message &&
                data.message.includes('limit exceeded')
              ) {
                this.unApprovedAccount = true
              }
            } else {
              this.unApprovedAccount = true
            }
            // this.$store.commit('invoice/setGuideImage', 'yellow-image')
          }
          this.loading = false
          this.processing = false
          if (this.unApprovedAccount) {
            setTimeout(() => {
              this.kycCheck()
            }, 8000)
          }
        })
    },
    async emailCheck() {
      this.processing = true
      const payload = {
        email: this.info.email,
      }
      try {
        await this.$axios.post('/email/check', payload)
        this.isEmailVerified = true
        await this.kycCheck()
      } catch (e) {
        setTimeout(() => {
          this.emailCheck()
        }, 15000)
      } finally {
        this.pageLoading = false
        this.processing = false
      }
    },
    async fetchDepositDetails(callback) {
      this.processingPaymentDetails = true
      this.$store.commit('order/changeLoading', {
        show: true,
        text: 'Loading payment info...',
      })

      let resp, defaultAddress

      try {
        if (this.info.type === 'buy') {
          // resp = await this.$axios.get('/get_deposit_account/', {
          //   params: { trade_id: this.orderID },
          // })
          const { data } = await this.$api.getProvider({
            trade_id: this.orderID,
            code: this.selectedProvider.code || 'otc',
          })
          resp = data
        } else {
          resp = await this.$axios.get('/get_address/', {
            params: { trade_id: this.orderID, network: this.activeNetwork },
          })

          defaultAddress = resp.data.address
          this.networkAddress = defaultAddress
        }

        this.deposit = resp.data

        // we want qr image generated to be readily available before step changes during sell orders.

        if (this.info.type === 'buy' && this.step != 'paid') {
          this.$store.commit('invoice/setStep', 'pay')
          this.$store.commit('invoice/setGuideImage', 'payment1')
          // this.step = 'pay'
        }

        // console.log('here')
        // set 15 secs interval to detect payment if not OTC
        if (!this.info.isOtc) {
          this.interval34 = setInterval(() => this.detectPayment(), 15000)
        }

        if (callback) {
          callback()
        }

        // this.interval34 = setInterval(() => this.detectPayment(), 15000)

        // this.loading = false
      } catch (err) {
        const errorR = err.response
        // console.error(errorR)

        if (errorR && errorR.status === 422) {
          if (
            errorR.data.message &&
            errorR.data.message.includes('Unapproved account')
          ) {
            // this.purchase_error = true
            this.unApprovedAccount = true
          }
        }

        // if (errorR && errorR.status === 404) {
        // }
      } finally {
        this.$store.commit('order/changeLoading', { show: false, text: '' })
        this.processingPaymentDetails = false
      }
    },
    async detectPayment() {
      this.processing = true
      try {
        const { data } = await this.$axios.get(`/invoice/${this.orderID}`)

        this.$store.commit('invoice/setInfo', data)

        if (data && data.transactions.length > 0) {
          clearInterval(this.interval34)

          this.$store.commit('invoice/setPaid', true)
          this.$store.commit('invoice/setStep', 'paid')
        }
      } catch (e) {
        if (e.response.status === 400) {
          clearInterval(this.interval34)
          // redirect to homepage
          this.$router.push('/order/start')
          // console.log('Detect payment error', e)
        }
      } finally {
        this.processing = false
      }
    },
    markOrderPaid() {
      this.loading = true
      // this.markedAsPaid = true
      // For otc transactions
      this.$axios
        .post('/mark_paid', { tradeId: this.orderID })
        .then((res) => {
          this.detectPayment()
          this.loading = false
          this.$store.commit('invoice/setPaid', true)
          // toast some information
        })
        .catch((err) => {
          // console.log(err)
          this.loading = false
          // this.markedAsPaid = false
        })
    },
    markOrderPaidFromChild(callback) {
      this.loading = true
      // this.markedAsPaid = true
      // For otc transactions
      this.$axios
        .post('/mark_paid', { tradeId: this.orderID })
        .then((res) => {
          // this.interval34 = setInterval(() => this.detectPayment(), 15000)
          // this.detectPayment()
          this.loading = false
          callback()
          this.$store.commit('invoice/setPaid', true)
          this.$store.commit('invoice/setStep', 'paid')
          // toast some information
        })
        .catch((err) => {
          // console.log(err)
          this.loading = false
          // this.markedAsPaid = false
          callback()
        })
    },
    emitMarkOrderPaid(data) {
      this.markOrderPaidFromChild(data)
      // data()
    },
    emitFetchDepositDetails(data) {
      this.fetchDepositDetails(data)
      // data()
    },
    selectedNetwork(network) {
      this.activeNetwork = network
    },
    setSelectedProvider(provider) {
      this.selectedProvider = provider
    },
    toggleCopyText() {
      this.copyText = 'Copied'
      const vm = this
      setTimeout(() => {
        vm.copyText = 'Copy address'
      }, 2000)
    },
    terminateSession() {
      this.$cookiz.remove('a2snXbe')
      this.$cookiz.remove('eJ6Ydkmr035')
      this.$cookiz.remove('ftyp5h2nl')
    },
    generateQr(address) {
      // console.log('address', address)
      const payload = {
        data:
          this.info.cryptoCurrency === 'BTC'
            ? `bitcoin:${address}?amount=${this.info.cryptoAmount}`
            : address,
        config: {
          body: 'circle',
          eye: 'frame13',
          eyeBall: 'ball15',
          bodyColor: '#000000', //'#4D4D4D', // #0277BD
          bgColor: '#ffffff', //'#FBFBFB',
          eye1Color: '#000000', //'#4D4D4D',
          eye2Color: '#000000', //'#4D4D4D',
          eye3Color: '#000000', //'#4D4D4D', // #075685
          eyeBall1Color: '#000000', //'#0277BD',
          eyeBall2Color: '#000000', //'#0277BD',
          eyeBall3Color: '#000000', //'#0277BD',
          gradientColor1: '#000000', //'#162E55',
          gradientColor2: '#000000', //'#203C69',
          gradientType: 'linear',
          gradientOnEyes: false,
          logo: 'https://mvp.senexhomes.com/logo-11.png',
        },
        size: 200,
        download: true,
        file: 'png',
      }

      this.$axios
        .post('https://qrcode-monkey.p.rapidapi.com/qr/custom', payload, {
          headers: {
            'content-type': 'application/json',
            'x-rapidapi-key':
              'a677be5f82msh182f147513202dfp1ca50cjsnef573ef2c12a',
            'x-rapidapi-host': 'qrcode-monkey.p.rapidapi.com',
          },
        })
        .then((res) => {
          this.qrCode = res.data.imageUrl

          if (this.step != 'paid') {
            this.$store.commit('invoice/setStep', 'pay')
            this.$store.commit('invoice/setGuideImage', 'payment1')
          }
          this.qrLoading = false
        })
        .catch((err) => {
          // console.log(err)
          // falback on vue-qrcode
          this.qrFallback = true
          this.qrLoading = false
        })
    },
  },
  beforeDestroy() {
    clearInterval(this.timerID)
    clearInterval(this.interval34)
  },
}
</script>

<style></style>
