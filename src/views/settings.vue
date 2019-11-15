<template>
  <main class="page settings">
    <div class="page-heading">
      <img @click="$router.push('/')" class="icon -mr-2 w-10 mb-0 -ml-3" src="@/assets/icons/back.svg">
      <h1>Settings</h1>
    </div>
    <div class="settings-options">
      <div v-if="false" class="settings-block">
        <div class="settings-block-header">
          <h3>Notifications</h3>
          <p>15min</p>
        </div>
        <p class="settings-block-desc">Choose how many minutes you would like to be notified before the departure of
          your train.</p>
        <div class="settings-block-notificationRow">
          <button class="notificationRow-option">5min</button>
          <button class="notificationRow-option">10min</button>
          <button class="notificationRow-option selected">15min</button>
          <button class="notificationRow-option">20min</button>
        </div>
      </div>
      <div class="settings-block">
        <div class="settings-block-header">
          <h3>Account</h3>
          <p>{{passphrase}}</p>
        </div>
        <p class="settings-block-desc">Arrival keeps your data completely anonymous however if you would like to delete
          your data please click the button below. If you think your account has been compromised please click the
          change passphrase button.</p>
        <div class="settings-block-accountRow ">
          <button v-if="false" class="accountRow-option btn--outline red mb-2 ">DELETE ACCOUNT</button>
          <button @click="logout" class="accountRow-option btn">LOGOUT</button>

        </div>
      </div>

      <p class="copyright">Client v{{this.$parent.version}} <br> Server v{{$store.getters.serverVersion}} <br> Arrival is an open source project by Ronan Furuta</p>
    </div>
  </main>
</template>
<script>
  export default {
    name: 'settings',
    computed: {
      passphrase() {
        return this.$store.getters.getAuthentication.passphrase
      }
    },

    methods: {
      logout() {
        this.$parent.passphrase = null
        this.$store.commit('setPassphrase', false)
        this.$store.commit('setKey', false)
        localStorage.removeItem("passphrase");
        this.$parent.init()
      }
    }
  }
</script>