<template>
  <div class="">
    <div
      v-if="user.profile.status != 'Approved'"
      class="index-complete-kyc u-mb-20"
    >
      <div class="index-complete-kyc__info u-mr-10">
        <img
          src="img/icons/green_round_checkmark.svg"
          alt="checkmark"
          class="u-mr-10"
        />
        <p>Complete your KYC to enjoy more features on SenexPay</p>
      </div>
      <div
        class="index-complete-kyc__link-box u-pointer"
        @click="$router.push('/profile')"
      >
        <p class="u-link u-mr-10">Complete your KYC</p>
        <svg
          class="icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 11.115 18"
        >
          <path
            id="Icon_material-navigate-next"
            data-name="Icon material-navigate-next"
            d="M15,9l-2.115,2.115L19.755,18l-6.87,6.885L15,27l9-9Z"
            transform="translate(-12.885 -9)"
            fill="#ffffff"
          />
        </svg>
      </div>
    </div>
    <div class="index-marquee u-mb-20" direction="left">
      <div class="index-rate-box">
        <div class="rate">
          <p class="u-mr-10">1 BTC = 23,079,836</p>
          <img
            :src="`img/icons/${
              true ? 'green_triangle_up' : 'red_triangle_down'
            }.svg`"
            alt="arrow"
            class="u-mr-10"
          />
          <p>-2.08%</p>
        </div>
        <div class="rate">
          <p class="u-mr-10">1 BTC = 23,079,836</p>
          <img
            :src="`img/icons/${
              false ? 'green_triangle_up' : 'red_triangle_down'
            }.svg`"
            alt="arrow"
            class="u-mr-10"
          />
          <p>-2.08%</p>
        </div>
        <div class="rate">
          <p class="u-mr-10">1 BTC = 23,079,836</p>
          <img
            :src="`img/icons/${
              true ? 'green_triangle_up' : 'red_triangle_down'
            }.svg`"
            alt="arrow"
            class="u-mr-10"
          />
          <p>-2.08%</p>
        </div>
      </div>
    </div>
    <router-link to="/order" class="index-float-btn"
      ><img src="/img/icons/transaction_icon_blue.svg" alt="order"
    /></router-link>
    <div class="index-show-cur-switch u-mb-20">
      <CurrencySwitch />
    </div>
    <div class="index-txn-info">
      <transaction-card
        text="Total Transaction"
        :amount="
          buy[selectedFiatCurrency.ticker] + sell[selectedFiatCurrency.ticker]
        "
        :count="
          buy[`${selectedFiatCurrency.ticker}_COUNT`] +
          sell[`${selectedFiatCurrency.ticker}_COUNT`]
        "
        :currency="selectedFiatCurrency.ticker"
      ></transaction-card>
      <transaction-card
        text="Total Buy"
        :amount="buy[selectedFiatCurrency.ticker]"
        :count="buy[`${selectedFiatCurrency.ticker}_COUNT`]"
        :currency="selectedFiatCurrency.ticker"
      ></transaction-card>
      <transaction-card
        text="Total Sell"
        :amount="sell[selectedFiatCurrency.ticker]"
        :count="sell[`${selectedFiatCurrency.ticker}_COUNT`]"
        :currency="selectedFiatCurrency.ticker"
      ></transaction-card>
    </div>
    <div class="index-txn-earn-ex u-my-big">
      <div class="index-recent-txn">
        <div class="u-flex u-flex--space-between u-flex--align-center u-mb-30">
          <h3 class="heading-secondary">Recent Transactions</h3>
          <router-link to="/transactions" class="u-link">See all</router-link>
        </div>
        <template v-if="orders.length > 0">
          <div class="index-recent-txn__rct-box">
            <div
              v-for="(order, idx) in orders"
              :key="idx"
              class="index-recent-txn__item"
            >
              <img
                :src="`img/crypto/${order.cryptoCurrency.toLowerCase()}.svg`"
                alt="coin"
              />
              <div class="coin-date">
                <h4 class="fw-500 heading-tertiary">
                  {{ order.cryptoCurrency }}
                </h4>
                <p class="small-text">{{ formatDate(order.created) }}</p>
              </div>
              <h4 class="amount fw-700">
                {{ order.fiatAmount | formatMoney(order.fiatCurrency) }}
              </h4>
            </div>
          </div>
        </template>
        <template v-else>
          <EmptyState
            heading="No Recent Transaction"
            content="When you make your first transaction, the details will show up here."
            btnText="Buy/Sell"
            :btnFunction="() => $router.push('/order')"
          />
        </template>
      </div>
      <div class="index-earn-ex">
        <div class="index-earn">
          <div class="index-earn__top">
            <div class="index-earn__content">
              <img src="img/icons/icon_metro_trophy.svg" alt="cup" />
              <span class="small-text">Comrade</span>
            </div>
            <div class="index-earn__content index-earn__content--1">
              <span class="small-text">You have earned</span>
              <h3 class="heading-primary">
                {{ totalEarned | formatMoney('USD') }}
              </h3>
            </div>
            <div class="index-earn__content">
              <img
                src="img/icons/icon_awesome_users.svg"
                class="users"
                alt="cup"
              />
              <span class="fw-700">{{ activeReferralUsers }}</span>
            </div>
          </div>
          <BtnSpinner
            :is-in-active="false"
            :is-loading="false"
            value="Invite more friends"
            setClass="index-earn__btn"
            :on-submit="
              () => {
                $router.push('/invite')
              }
            "
          />
        </div>
        <div class="index-ex">
          <h3 class="heading-secondary index-ex__heading u-mb-20">Exchange</h3>
          <div class="index-ex__rate-and-btn">
            <div class="index-ex__rate-box">
              <div class="index-ex__rate-item">
                <div class="coin">
                  <img src="img/crypto/btc.svg" alt="coin" class="u-mr-5" />
                  <span>Bitcoin</span>
                </div>
                <div class="rate">
                  <span>{{ $n((btcUSDT ? btc_conv : '' ), 'currency', this.selectedFiatCurrency.locale) }}</span>
                  <span v-if="styledUp">
                    <span :class="btcUSDT.style === 'loss' ? 'loss' : 'gain'">{{ btcUSDT ? btcUSDT.arrow : '' }}</span>
                    {{ btcUSDT ? btcUSDT.percent : '' }}%
                  </span>
                </div>
              </div>
              <div class="index-ex__rate-item">
                <div class="coin">
                  <img src="img/crypto/usdt.svg" alt="coin" class="u-mr-5" />
                  <span>USDT</span>
                </div>
                <div class="rate">
                  <span>{{ $n((USDT ? usdt_conv : '' ), 'currency', this.selectedFiatCurrency.locale) }}</span>
                  <span v-if="styledUS">
                    <span :class="USDT.style === 'loss' ? 'loss' : 'gain'">{{ USDT ? USDT.arrow : '' }}</span>
                    {{ USDT.percent }}%
                  </span>
                </div>
              </div>
            </div>
            <BtnSpinner
              :is-in-active="false"
              :is-loading="false"
              value="Buy/Sell"
              setClass="index-ex__btn"
              :on-submit="
                () => {
                  $router.push('/order')
                }
              "
            />
          </div>
        </div>
      </div>
    </div>
    <div class="index-guide u-mb-30">
      <img
        src="img/icons/crypto-advisor.svg"
        class="index-guide__advisor"
        alt="lady"
      />
      <img
        src="img/icons/footer-side-corner.svg"
        class="index-guide__tr-img"
        alt="ellipse"
      />
      <img
        src="img/icons/footer-polygon.svg"
        class="index-guide__tr-star"
        alt="star"
      />
      <div class="index-guide__content">
        <h3 class="heading-primary--md">
          <span class="u-block u-line-height-1">New to Crypto?</span>
          <span class="u-block">Let’s guide you.</span>
        </h3>
        <p class="small-text">
          Join our Crypto Advisor programme and get expert advice.
        </p>
        {{dataList}}
      </div>
      <a
        href="https://www.eventbrite.co.uk/e/talk-to-a-crypto-advisor-tickets-319295329927"
        target="_blank"
        class="index-guide__btn"
        >Book a session</a
      >
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import formatMoney from '~/filters/format-money'
import moment from 'moment'
export default {
  layout: 'dashboard',
  middleware: 'authenticated',
  head() {
    return {
      title: 'Dashboard | SenexPay ',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'SenexPay Dashboard',
        },
      ],
    }
  },
  filters: {
    formatMoney,
  },
  data() {
    return {
      selected: '₦',
      totalOrderValue: 0,
      buy: {
        NGN: 0,
        NGN_COUNT: 0,
        USD: 0,
        USD_COUNT: 0,
        ZAR: 0,
        ZAR_COUNT: 0,
        completed: 0,
        expired: 0,
      },
      sell: {
        NGN: 0,
        NGN_COUNT: 0,
        USD: 0,
        USD_COUNT: 0,
        ZAR: 0,
        ZAR_COUNT: 0,
        completed: 0,
        expired: 0,
      },
      selectedCurrency: 'NGN',
      options: [
        {
          text: 'NGN',
          value: '₦',
        },
        {
          text: 'ZA',
          value: 'R',
        },
      ],
      orders: [],
      totalEarned: 0,
      activeReferralUsers: 0,
      windowWidth: 0,
      timerID: null,
      prevRates: {
        BTC_NGN: {
          buy: 0,
          sell: 0,
          USD_NGN: {
            buy: 0,
            sell: 0,
          },
          minimumOrder: {
            buy: 0,
            sell: 0,
          },
          disable: {
            buy: false,
            sell: false,
          },
        },
      },
      dataList: null,
      rates: {
        BTC_NGN: {
          buy: 0,
          sell: 0,
          USD_NGN: {
            buy: 0,
            sell: 0,
          },
          minimumOrder: {
            buy: 0,
            sell: 0,
          },
          disable: {
            buy: false,
            sell: false,
          },
        },
      },
      endpoint : 'wss://stream.binance.com:9443/ws/!ticker@arr',
      iconbase : 'https://raw.githubusercontent.com/rainner/binance-watch/master/public/images/icons/',
      cache    : {},             // coins data cache
      coins    : [],             // live coin list from api
      asset    : 'USDT',          // filter by base asset pair
      search   : '',             // filter by search string
      sort     : 'assetVolume',  // sort by param
      order    : 'desc',         // sort order ( asc, desc )
      limit    : 50,             // limit list
      status   : 0,              // socket status ( 0: closed, 1: open, 2: active, -1: error )
      sock     : null,
    }
  },
  async asyncData() {
    let ngn_price, rand_price, usd_price;
    await fetch('https://api.senex.xyz/rates/')
      .then(resp => resp.json())
      .then((data) => {
        rand_price = data.BTC_ZAR.USD_ZAR.buy
        ngn_price = data.BTC_NGN.USD_NGN.buy
      });
    return {ngn_price, rand_price, usd_price}
  },
  watch: {
    selectedFiatCurrency(val) {
      this.fetchOrders()
    },
  },
  beforeMount() {
    // this.getRates(true)
    this.getOrderAnalytics()
    // this.getDashboard()
    this.fetchOrders()
    this.getReferrals()
  },
  mounted() {
    // this.$axios.$get('https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/eur/jpy.json')
    this.sockInit()
    this.windowWidth = window.innerWidth
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize)
    })
    // this.timerID = setInterval(() => {
    //   this.getRates(false)
    // }, 1000)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
  },
  computed: {
    styledUp(){
      return this.btcUSDT?.style
    },
    styledUS(){
      return this.USDT?.style !== undefined
    },
    btc_conv(){
      return this.btcUSDT.close * (this.selectedFiatCurrency.ticker === "NGN" ? this.ngn_price : this.rand_price)
    },
    usdt_conv(){
      return this.USDT.close * (this.selectedFiatCurrency.ticker === "NGN" ? this.ngn_price : this.rand_price)
    },
    btcUSDT(){
      return this.coins.find((coin) => {
        return coin.pair === 'BTC/USDT'
      })
    },
    USDT(){
      return this.coins.find((coin) => {
        return coin.name === "USDCBUSD"
      })
    },
    // process coins list
    coinsList() {
      let list = this.coins.slice();
      let search = this.search.replace( /[^\s\w\-\.]+/g, '' ).replace( /[\r\s\t\n]+/g, ' ' ).trim();

      if ( this.asset ) {
        list = list.filter( i => i.asset === this.asset );
      }
      if ( search && search.length > 1 ) {
        let reg = new RegExp( '^('+ search +')', 'i' );
        list = list.filter( i => reg.test( i.token ) );
      }
      if ( this.sort ) {
        list = this.sortList( list, this.sort, this.order );
      }
      if ( this.limit ) {
        list = list.slice( 0, this.limit );
      }
      return list;
    },

    // show socket connection loader
    loaderVisible() {
      return ( this.status === 2 ) ? false : true;
    },

    // sort-by label for buttons, etc
    sortLabel() {
      switch ( this.sort ) {
        case 'token'       :  return 'Token';
        case 'percent'     :  return 'Percent';
        case 'close'       :  return 'Price';
        case 'change'      :  return 'Change';
        case 'assetVolume' :  return 'Volume';
        case 'tokenVolume' :  return 'Volume';
        case 'trades'      :  return 'Trades';
        default            :  return 'Default';
      }
    },
    ...mapState('auth', ['user']),
    ...mapState({
      selectedFiatCurrency: (state) => state.selectedFiatCurrency,
    }),
  },
  methods: {
    // apply sorting and toggle order
    sortBy( key, order ) {
      if ( this.sort !== key ) { this.order = order || 'asc'; }
      else { this.order = ( this.order === 'asc' ) ? 'desc' : 'asc'; }
      this.sort = key;
    },

    // filter by asset
    filterAsset( asset ) {
      this.asset = String( asset || 'BTC' );
    },

    // set list limit
    setLimit( limit ) {
      this.limit = parseInt( limit ) || 0;
    },

    // on socket connected
    onSockOpen( e ) {
      this.status = 1; // open
      const msg =
        {
          method: "SUBSCRIBE",
          params: ["btcusdt@trade", "usdtusdt@trade"],
          id: 1
        };

      this.sock.send(JSON.stringify(msg));
      console.info( 'WebSocketInfo:', 'Connection open ('+ this.endpoint +').' );
    },

    // on socket closed
    onSockClose( e ) {
      this.status = 0; // closed
      console.info( 'WebSocketInfo:', 'Connection closed ('+ this.endpoint +').' );
      setTimeout( this.sockInit, 10000 ); // try again
    },

    // on socket error
    onSockError( err ) {
      this.status = -1; // error
      console.error( 'WebSocketError:', err.message || err );
      setTimeout( this.sockInit, 10000 ); // try again
    },

    // process data from socket
    onSockData( e ) {
      let oList = JSON.parse( e.data ) || [];
      // this.dataList = `checking data${e.data}}`
      let list = Array.from(oList)
      list.forEach((item)=> {
        let c = this.getCoinData(item);
        // keep to up 100 previous close prices in hostiry for each coin
        c.history = this.cache.hasOwnProperty(c.symbol) ? this.cache[c.symbol].history : this.fakeHistory(c.close);
        if (c.history.length > 100) c.history = c.history.slice(c.history.length - 100);
        c.history.push(c.close);
        // add coin data to cache
        this.cache[c.symbol] = c;
      })
        // convert cache object to final prices list for each symbol
        this.coins = Object.keys(this.cache).map(s => this.cache[s]);
        this.status = 2; // active
    },

    // start socket connection
    sockInit() {
      if ( this.status > 0 ) return;
      try {
        this.status = 0; // closed
        this.sock = new WebSocket( this.endpoint );
        this.sock.addEventListener( 'open', this.onSockOpen );
        this.sock.addEventListener( 'close', this.onSockClose );
        this.sock.addEventListener( 'error', this.onSockError );
        this.sock.addEventListener( 'message', this.onSockData );
      }
      catch( err ) {
        console.error( 'WebSocketError:', err.message || err );
        this.status = -1; // error
        this.sock = null;
      }
    },

    // start socket connection
    sockClose() {
      if ( this.sock ) {
        this.sock.close();
      }
    },

    // come up with some fake history prices to fill in the initial line chart
    fakeHistory( close ) {
      let num = close * 0.0001; // faction of current price
      let min = -Math.abs( num );
      let max = Math.abs( num );
      let out = [];

      for ( let i = 0; i < 50; ++i ) {
        let rand = Math.random() * ( max - min ) + min;
        out.push( close + rand );
      }
      return out;
    },

    // finalize data for each coin from socket
    getCoinData( item ) {
      let reg         = /^([A-Z]+)(BTC|USDT|USDC)$/;
      let symbol      = String( item.s ).replace( /[^\w\-]+/g, '' ).toUpperCase();
      let token       = symbol.replace( reg, '$1' );
      let asset       = symbol.replace( reg, '$2' );
      let name        = token;
      let pair        = token +'/'+ asset;
      let icon        = this.iconbase + token.toLowerCase() + '_.png';
      let open        = parseFloat( item.o );
      let high        = parseFloat( item.h );
      let low         = parseFloat( item.l );
      let close       = parseFloat( item.c );
      let change      = parseFloat( item.p );
      let percent     = parseFloat( item.P );
      let trades      = parseInt( item.n );
      let tokenVolume = Math.round( item.v );
      let assetVolume = Math.round( item.q );
      let sign        = ( percent >= 0 ) ? '+' : '';
      let arrow       = ( percent >= 0 ) ? '▲' : '▼';
      let info        = [ pair, close.toFixed( 8 ), '(', arrow, sign + percent.toFixed( 2 ) +'%', '|', sign + change.toFixed( 8 ), ')' ].join( ' ' );
      let style       = '';

      if ( percent > 0 ) style = 'gain';
      if ( percent < 0 ) style = 'loss';

      return { symbol, token, asset, name, pair, icon, open, high, low, close, change, percent, trades, tokenVolume, assetVolume, sign, arrow, style, info };
    },

    // sort an array by key and order
    sortList( list, key, order ) {
      return list.sort( ( a, b ) => {
        let _a = a[ key ];
        let _b = b[ key ];

        if ( _a && _b ) {
          _a = ( typeof _a === 'string' ) ? _a.toUpperCase() : _a;
          _b = ( typeof _b === 'string' ) ? _b.toUpperCase() : _b;

          if ( order === 'asc' ) {
            if ( _a < _b ) return -1;
            if ( _a > _b ) return 1;
          }
          if ( order === 'desc' ) {
            if ( _a > _b ) return -1;
            if ( _a < _b ) return 1;
          }
        }
        return 0;
      });
    },
    onResize() {
      this.windowWidth = window.innerWidth
    },
    formatDate(thisDate) {
      if (this.windowWidth <= 600) {
        return moment(thisDate).format('MMM DD, YYYY')
      }
      return moment(new Date(thisDate)).format('lll')
    },
    async getRates(initial) {
      try {
        const { data } = await this.$api.getRates()
        if (initial) {
          this.prevRates = data
          this.rates = data
        } else {
          if (this.isRateChanged(data)) {
            this.prevRates = this.rates
          }
          this.rates = data
        }
      } catch (err) {
        // this.getRates()
      }
    },
    async getOrderAnalytics() {
      const { data } = await this.$api.getOrderAnalytics()
      try {
        if (data.buy || data.sell) {
          this.buy = data.buy
          this.sell = data.sell
        }
      } catch (error) {
        this.$notify({
          title: 'Error',
          text: 'An error occured fetching order summary.',
          type: 'error',
        })
      }
    },
    async fetchOrders() {
      try {
        this.processing = true
        const { data } = await this.$api.fetchTrades({})
        this.orders = data.results
          .sort((a, b) => new Date(b.created) - new Date(a.created))
          .splice(0, 5)
        this.totalPages = parseInt((data.count - 1) / this.perPage) + 1
        this.processing = false
      } catch (error) {
        this.processing = false
        this.$notify({
          text: 'An error occured when fetching orders',
          type: 'error',
        })
      }
    },
    async getReferrals() {
      const { data } = await this.$api.getReferrals()
      try {
        this.activeReferralUsers = data.referralCount
        this.totalEarned = data.totalEarned
      } catch (error) {
        this.$notify({
          text: 'An error occured when fetching referrals',
          type: 'error',
        })
      }
    },
    getCoinAmountAndRise(currency, type) {
      console.log(this.rates)
      // new rate
      const fiatCurrency = this.selectedFiatCurrency.ticker
      const newCryptoFiat = this.rates[`${currency}_${fiatCurrency}`][type]

      // old rate
      const prevCryptoFiat = this.prevRates[`${currency}_${fiatCurrency}`][type]

      const riseOrFall =
        ((newCryptoFiat - prevCryptoFiat) / prevCryptoFiat) * 100

      console.log(riseOrFall, newCryptoFiat, prevCryptoFiat)
      return {
        riseOrFall: Number(riseOrFall.toFixed(2)),
        amount: newCryptoFiat,
      }
    },
    isRateChanged(newRate) {
      let isChanged = false
      for (const key in this.rates) {
        if (
          this.rates[key].buy != newRate[key].buy ||
          this.rates[key].sell != newRate[key].sell
        ) {
          isChanged = true
          break
        }
      }
      return isChanged
    },
    getCryptoList() {
      const list = Object.keys(this.rates)
      const split = list.map((key) => {
        return key.split('_')[0]
      })
      const set = new Set(split)
      console.log(
        'set',
        Array.from(set).filter((item) => item !== 'config')
      )
      return Array.from(set).filter((item) => item !== 'config')
    },
  },
}
</script>
<style>
  .gain {
    color: #04953b;
  }
  .loss {
    color: #950404;
  }
</style>
