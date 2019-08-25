<template>
  <main class="page auth">
    <router-link to="/featureAnonymous" class="back">back</router-link>
    <form @submit.prevent>
      <input disabled required placeholder="enter your passphrase" v-model="passphrase" type="text">
      <p class="error">{{error}}</p>
    </form>
    <p>Arrival’s syncing is a little different. We generate your passphrase randomly. This allows us to ensure that none of the data we collect can be directly linked to you. In order to transfer or retrieve your data just enter this passphrase when you first start the app. <b>You might want to write this down. If you forget it, all of your data will be lost</b></p>
    <button @click="createNewAccount" class="btn">CONFIRM</button>
  </main>
</template>
<script>
  const shortid = require('shortid');
  export default {
    name: 'login',
    data() {
      return {
        passphrase: null,
        error: null
      }
    },
    mounted() {
      this.passphrase = shortid.generate()
    },
    methods: {
      createNewAccount() {
        if (this.passphrase) {
          fetch('https://api.arrival.stomprocket.io/api/v1/createAccount', {
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
            if (res.success) {
              localStorage.setItem("passphrase", this.passphrase);
              this.$parent.passphrase = this.passphrase
              console.log('good phrase')

              this.$parent.init(this.passphrase)
            } else {
              this.error = 'passphrase invalid'
            }
          })
        }

      }
    }
  }
</script>
