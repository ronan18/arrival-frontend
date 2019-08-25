<template>
  <div id="app">

    <router-view/>
  </div>
</template>
<script>
  import '@/assets/css/tailwind.scss'
  import '@/assets/css/app.scss'

  export default {
    name: 'App',
    data() {
      return {
        position: {},
        appData: false,
        version: '1.0.1',
        apiKey: null,
        apiURL: null,
        passphrase: false
        //  passphrase: 'passphrase'
      }
    },
    mounted() {

      let path

      path = this.$route.path
      this.$router.push('/loading')
      if (!this.passphrase) {
        this.passphrase = localStorage.getItem("passphrase");
      }

      if (this.passphrase) {
        this.init()
      } else {
        this.$router.push('welcome')
      }


    },
    methods: {
      init(pass) {
        if (pass) {
          this.passphrase = pass
        }
        let path = this.$route.path
        this.$router.push('/loading')
        if (this.passphrase) {
          this.$io.emit('passphrase', {pass: this.passphrase, version: this.version})
          this.$io.on('apiKey', key => {
            this.apiKey = key.key;
            this.apiURL = key.url;
          })
          this.$io.on('passphraseValid', (valid) => {
            console.log('passphrase valid?', valid)
            if (valid) {

              this.$io.emit('requestApiKey', {pass: this.passphrase})
              if (navigator.geolocation) {
                console.log('getting location')
                navigator.geolocation.getCurrentPosition((pos) => {

                  //console.log(pos)
                  this.position = {
                    coords: {lat: pos.coords.latitude, long: pos.coords.longitude}, timestamp: pos.timestamp
                  }
                  //this.position = {"coords": {"lat": 37.804363, "long": -122.271111}, "timestamp": 1560427057716}
                  this.$io.emit('location', this.position)

                  document.body.scrollTop = 0; // For Safari
                  document.documentElement.scrollTop = 0;
                  this.$io.on('appData', (data) => {

                    this.appData = data

                    console.log('new app data', this.appData.fromStation.name)
                    if (path === '/loading') {
                      this.$router.push('/')
                      path = false
                    } else if (path) {
                      //  console.log('path', path)
                      this.$router.push(path)
                      path = false
                    }

                  })
                  this.$io.on('trainsUpdate', (data) => {
                    this.appData.trains = data

                  })


                });
              } else {
                console.log('position error')
              }


            } else {
              console.log(this.passphrase, localStorage.getItem('passphrase'))
              this.$router.push('/welcome')
              //localStorage.setItem("passphrase", null);
            }
          })
        } else {
          this.$router.push('/welcome')
        }
      }
    }
  }
</script>

