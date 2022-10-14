<template>
  <div>
    <div class="checkout checkout--no-min-height">
      <div class="invoice">
        <div class="invoice__header invoice__header--success">
          <div class="invoice__title-box">
            <div class="invoice__title-heading">
              <span class="heading-primary">INVOICE</span>
              <span class="invoice__status">PAID</span>
            </div>
            <p class="paragraph paragraph--sm m-0 u-mb-5">
              Invoice No.:
              <span class="fw-700">{{ orderID }}</span>
            </p>
            <p
              class="paragraph paragraph--sm invoice__see-order p-0 m-0"
              @click="$emit('setShowReview', true)"
            >
              See my order details
            </p>
          </div>
          <!-- <CheckoutTimer :timeLeft="timeLeft" :isCheckout="false" /> -->
        </div>
        <div class="invoice__body">
          <div class="invoice__success-box">
            <span class="invoice__success-text"
              >Thank you for making payment!</span
            >
            <img
              src="/img/celebration.svg"
              alt="Success"
              class="invoice__success-img"
            />
            <h3 v-if="info.type == 'buy'" class="invoice__amount">
              {{
                (info.fiatAmount + info.platformFee)
                  | formatMoney(info.fiatCurrency)
              }}
            </h3>
            <h3 v-if="info.type == 'sell'" class="invoice__amount">
              {{ info.cryptoAmount }} {{ info.cryptoCurrency }}
            </h3>
          </div>
          <a v-if="paid && info.isOtc" :href="`https://wa.me/+2349162598206?text=Hey,%20please%20attend%20to%20my%20premium%20order%20with%20ID%20-%20${orderID}.%20Attached%20below%20is%20my%20payment%20proof.`" target="_blank" class="whatsapp--btn blue">
            <i class='bx bxl-whatsapp text-white mr-2'></i>
            Send payment reciept
          </a>
          <nuxt-link to="/" class="whatsapp--btn">
            Return to Home
          </nuxt-link>
        </div>
      </div>
    </div>
    <div class="mt-5 text-center">
      <nuxt-link class="cursor-pointer flex items-center justify-center text-2xl" to="/order/start">
        <i class='bx bx-link mr-1 text-3xl' ></i> <span class="underline">Start a new order</span>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import formatMoney from '~/filters/format-money'

export default {
  filters: { formatMoney },
  props: {
    timeLeft: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {}
  },
  computed: {
    ...mapState({
      orderID: (state) => state.invoice.orderID,
      info: (state) => state.invoice.info,
      paid: (state) => state.invoice.paid,
      step: (state) => state.invoice.step,
    }),
  },
}
</script>

<style lang="scss">
.whatsapp--btn {
  padding: 15px;
  border: 0;
  background: #cecece;
  display: flex;
  font-size: 1.5rem;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  color: #0a0a0a !important;
  transition: .3s ease-in-out;
  transform: scale(1);
  margin-bottom: 10px;
  max-height: 50px;
  img {
    height: 22px;
    margin-right: 10px;
    width: 22px;
    object-fit: contain;
  }
  .bxl-whatsapp {
    font-size: 2.4rem;
  }
  &:hover {
    background: #a9a9a9;
    transform: scale(.98);
    img {
      transform: scale(.98);
    }
  }
  &:active, &:focus {
    transform: scale(.95);
  }
  &.blue {
    background: rgb(5, 56, 136);
    color: #fafafa !important;
  }
}
</style>
