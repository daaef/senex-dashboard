<template>
  <div class="invite">
    <div class="invite__top-content u-mb-40">
      <div class="invite__header u-mb-20 u-white">
        <h3 class="heading-primary--big">
          Invite a friend to SenexPay and you’ll both get 10 USDT.
        </h3>
      </div>
      <p class="u-mb-20">
        Know someone curious about crypto? You’ll both receive NGN 4,158.16 in
        Bitcoin when they buy or sell NGN 41,581.65 or more on Coinbase!
        <router-link class="u-link" to="/">Learn more</router-link>.
      </p>
      <div class="invite__email-form">
        <div class="invite__email-box">
          <div class="invite__email-input-box u-mb-10">
            <input type="email" placeholder="Enter email addresses" />
          </div>
          <p class="invite__separate-email">Separate email with commas</p>
        </div>
        <div class="invite__send-invites">
          <button class="btn btn--px2py1 u-mb-10">Send Invites</button>
          <p class="u-link">Preview email</p>
        </div>
      </div>
    </div>
    <span class="invite__line u-mb-40"></span>
    <div class="invite__bottom-content">
      <div class="invite__link-and-social-box u-mb-20">
        <div class="invite__link-box">
          <h3 class="heading-primary fw-400 u-mb-10">Your invite code</h3>
          <div class="invite__link-input-box">
            <input type="text" />
            <span class="extra">Copy code</span>
          </div>
        </div>
      </div>
      <div class="invite__link-and-social-box u-mb-40">
        <div class="invite__link-box">
          <h3 class="heading-primary fw-400 u-mb-10">Your invite link</h3>
          <div class="invite__link-input-box">
            <input type="text" />
            <span class="extra">Copy link</span>
          </div>
        </div>
        <div class="invite__social-box">
          <h3 class="heading-primary fw-400 u-mb-10">Share via social</h3>
          <div class="invite__social-img-box">
            <a
              href="https://www.instagram.com/senexpay/"
              target="_blank"
              rel="noopener"
              ><img src="/img/white-instagram.svg" alt="instagram"
            /></a>
            <a
              href="https://web.facebook.com/senexpay/"
              target="_blank"
              rel="noopener"
              ><img src="/img/white-facebook.svg" alt="facebook"
            /></a>
            <a
              href="https://twitter.com/senexng/"
              target="_blank"
              rel="noopener"
              ><img src="/img/white-twitter.svg" alt="twitter"
            /></a>
            <a
              href="https://linkedin.com/company/senexpay/"
              target="_blank"
              rel="noopener"
              ><img src="/img/white-linkedin.svg" alt="linkedin"
            /></a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style></style>
