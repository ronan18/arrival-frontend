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
          console.log('logging in')
          fetch(this.$store.getters.getApi + '/api/v2/login', {
            headers: {
              'Authorization': this.passphrase
            },
            method: 'GET'
          }).then(res => res.json()).then(res => {
            console.log(res)
            if (res.user) {
              this.$store.commit('setPassphrase', this.passphrase)
              this.$store.commit('setKey', res.key)
              localStorage.setItem("passphrase", this.passphrase);
              this.$router.push('/')
              console.log('good phrase')
            } else {
              this.error = 'passphrase invalid'
            }
          })
        }

      }
    }
  }
</script>
