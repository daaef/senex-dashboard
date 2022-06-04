<template>
  <div class="checkout checkout--no-min-height">
    <div class="invoice">
      <div class="invoice__body u-p-40">
        <div class="u-text-center u-mb-20">
          <span class="info">i</span>
        </div>
        <p class="u-text-center paragraph">
          <span class="invoice__body-heading">PAYMENT INSTRUCTIONS</span>
        </p>
        <ul v-if="orderType == 'buy'">
          <li class="u-mb-30">
            Please make sure you transfer amount not less than
            <span class="u-fw-800">{{
              fiatAmount | formatMoney(fiatCurrency)
            }}</span
            >. Sending less than that amount will invalidate your transaction.
          </li>
          <li class="u-mb-30">
            Please enter the first 3 characters of your Invoice ID:
            <span class="u-fw-800">{{ invoiceId.slice(0, 3) }}</span> as the
            transaction description when paying via your bank app.
          </li>
        </ul>
        <ul v-else>
          <li class="u-mb-30">
            Please make sure you send crypto not less than
            <span class="u-fw-800"
              >{{ cryptoAmount }} {{ cryptoCurrency }}</span
            >
            to the receiving address. Sending less than that will invalidate
            your transaction.
          </li>
          <li class="u-mb-30">
            To make confirmations faster, send crypto using high network fees.
            Payments made after order is expired will not be processed.
          </li>
        </ul>

        <div class="u-text-center u-mb-20 u-mt-mini-md">
          <input v-model="checked" type="checkbox" name="check" id="check" />
          <label for="check" class="paragraph">I understand</label>
        </div>

        <ButtonSpinner
          :is-loading="processing"
          :is-in-active="!checked"
          value="Continue"
          background="#053888"
          :on-submit="onSubmit"
        />
      </div>
    </div>
  </div>
</template>

<script>
import formatMoney from '~/filters/format-money'
export default {
  filters: { formatMoney },
  props: {
    fiatAmount: {
      type: Number,
      default: 0,
    },
    fiatCurrency: {
      type: String,
      default: 'NGN',
    },
    cryptoAmount: {
      type: Number,
      default: 0,
    },
    cryptoCurrency: {
      type: String,
      default: 'BTC',
    },
    orderType: {
      type: String,
      default: 'buy',
    },
    invoiceId: {
      type: String,
      default: '',
    },
    networks: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      processing: false,
      // btnDisabled: true,
      checked: false,
    }
  },
  methods: {
    onSubmit() {
      if (this.networks.length > 0) {
        this.$store.commit('invoice/setInstructionChecked', true)
        return
      }
      this.processing = true
      this.$emit('emitFetchDepositDetails', () => {
        this.processing = false
      })
    },
  },
}
</script>

<style lang="scss">
ul {
  // padding-left: 0;
  list-style-position: outside;
  margin-left: 1em;
  margin-top: -10px;
}

.u-p-40 {
  padding: 40px !important;
}

.info {
  height: 24px;
  width: 24px;
  color: #05bf4c;
  padding: 0px 2px 2px 2px;
  display: inline-block;
  align-items: flex-start;
  justify-content: center;
  border-radius: 50%;
  border: 2px solid #05bf4c;
  text-align: center;
  font-weight: 800;
}
</style>
