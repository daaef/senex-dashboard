<template>
  <div class="checkout checkout--eq-height center-content">
    <div class="checkout__body">
      <div class="success-holder">
        <div class="success-auth-box">
          <div class="success-auth-box__header">
            <div class="success-auth-box__header-correct">
              <img src="/img/checkmark.svg" alt="authenticated">
            </div>
            <p class="paragraph">Account authenticated successfully</p>
          </div>
          <div class="success-auth-box__body">
            <div class="success-auth-box__img-holder">
              <img
                src="/img/auth-green-circle.svg"
                alt="green circle"
                class="success-auth-box__green-circles"
              />
              <img
                src="/img/auth-green-padlock.svg"
                alt="green padlock"
                class="success-auth-box__green-lock"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
}
</script>

<style lang="scss" scoped>

  .center-content {
    align-items: center;
    justify-content: center;
  }

  .success-holder {
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    color: #ffffff;
  }
  .success-auth-box {
    max-width: 250px;
    width: 100%;
    // height: 250px;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0px 0px 15px #0000001A;

    &__header {
      background-color: #053888;
      display: flex;
      align-items: center;
      padding: 20px;
    }

    &__header-correct {
      width: 15px;
      height: 15px;
      border-radius: 50%;
      margin-right: 10px;

      img {
        width: 100%;
      }
    }

    &__body {
      background-color: #ffffff;
      display: flex;
      height: 250px;
      align-items: center;
      justify-content: center;
    }

    &__img-holder {
      // width: 70px;
      // height: 70px;
      border-radius: 50%;
      position: relative;
    }

    &__green-circles {
      width: 100px;
      height: auto;
      object-fit: cover;
      animation: scalecircle .5s linear 2;
    }

    &__green-lock {
      width: 28px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      animation: shakelock .5s linear 1s 2 forwards;
    }
  }

  @keyframes shakelock {
    0% {
      transform: translate(-50%, -50%) rotate(-15deg);
    }
    50% {
      transform: translate(-50%, -50%) rotate(15deg);
    }
    100% {
      transform: translate(-50%, -50%) rotate(0deg);
    }
  }

  @keyframes scalecircle {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }
</style>