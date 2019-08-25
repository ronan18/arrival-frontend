<template>
  <main class="page auth">
    <router-link to="/featureAnonymous" class="back">back</router-link>
    <form @submit.prevent="login">
      <input required placeholder="enter your passphrase" v-model="passphrase" type="text">
      <p class="error">{{error}}</p>
    </form>
    <button @click="login" class="btn">LOGIN</button>
  </main>
</template>
<script>
  export default {
    name: 'login',
    data() {
      return {
        passphrase: null,
        error: null
      }
    },
    methods: {
      login() {
        if (this.passphrase) {
          fetch('https://api.arrival.stomprocket.io/api/v1/passphraseCheck', {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
              passphrase: this.passphrase
            })
          }).then(res => res.json()).then(res => {
            console.log(res)
            if (res.exists) {
              this.$parent.passphrase = this.passphrase
              this.$router.push('/')
              console.log('good phrase')
              localStorage.setItem("passphrase", this.passphrase);
              this.$parent.init()
            } else {
              this.error = 'passphrase invalid'
            }
          })
        }

      }
    }
  }
</script>
