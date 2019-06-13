<template>
  <div id="app">

    <router-view/>
  </div>
</template>
<script>
  export default {
    name: 'App',
    data() {
      return {
        position: {},
        appData: false
      }
    },
    mounted() {
      let path = this.$route.path
      this.$router.push('/loading')
      this.$io.emit('passphrase', 'passphrase')

      this.$io.on('passphraseValid', (valid) => {
        console.log('passphrase valid?', valid)
        if (valid) {

          if (navigator.geolocation) {
            console.log('getting location')
            //navigator.geolocation.getCurrentPosition((pos) => {

            //console.log(pos)
            // this.position = {coords: {lat: pos.coords.latitude, long: pos.coords.longitude}, timestamp: pos.timestamp}
            this.position = {"coords": {"lat": 42.451384399999995, "long": -71.2193787}, "timestamp": 1560427057716}
            this.$io.emit('location', this.position)
            this.$io.on('appData', (data) => {
              this.appData = data
              if (path) {
                this.$router.push(path)
                path = false
              } else if (path = '/loading') {
                this.$router.push('/')
                path = false
              }

            })
            this.$io.on('trainsUpdate', (data) => {
              this.appData.trains = data

            })

            // });
          } else {
            console.log('position error')
          }


        }
      })
    }
  }
</script>

