<template>
  <div>
    <div class="email-input-list">
      <div class="email-input-list__box">
        <div class="email-box">
          <div
            v-for="(item, idx) in list"
            :key="idx"
            class="email-input-list__item u-pointer"
            @click="removeEmail(idx)"
          >
            {{ item }} <span>x</span>
          </div>
        </div>
      </div>
      <input
        v-model="email"
        @keypress="isComma"
        type="text"
        placeholder="Enter email addresses"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      email: '',
      isEmailValid: false,
    }
  },
  watch: {
    email(val) {
      this.validateEmail(val)
    },
  },
  methods: {
    validateEmail(value) {
      const reg =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/
      if (reg.test(value)) {
        this.isEmailValid = true
      } else {
        this.isEmailValid = false
      }
    },
    removeEmail(index) {
      this.list.splice(index, 1)
    },
    isComma(evt) {
      const charCode = evt.which ? evt.which : evt.keyCode
      if (charCode == 44) {
        evt.preventDefault()
        if (this.isEmailValid && !this.list.includes(this.email)) {
          this.list.push(this.email)
          this.email = ''
        }
      }
    },
  },
}
</script>

<style lang="scss">
.email-input-list {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  width: 100%;
  padding: 1rem;
  border: 1px solid #707070;
  border-radius: 8px;
  background-color: transparent;

  &__box {
    display: flex;
  }

  &__item {
    display: inline-block;
    padding: 0 10px;
    background-color: gray;
    color: black;
    border-radius: 12px;
    margin: 2px 10px 2px 0;
  }

  input {
    flex: 1;
    background-color: transparent;
    border: none;
    outline: none;
    padding: 0 1rem;
    // min-width: 400px;
  }
}
</style>
