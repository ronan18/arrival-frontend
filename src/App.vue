<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
  import '@/assets/css/tailwind.scss'
  import '@/assets/css/app.scss'

  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180)
  }

  export default {
    name: 'App',
    data() {
      return {
        version: require('../package.json').version,
        apiKey: null,


        //  passphrase: 'passphrase'
      }
    },
    computed: {
      production() {
        return this.$store.getters.production
      }
    },

    created() {

      this.init()
    },
    methods: {
      init() {
        this.$router.push('/loading')
        if (document.location.hostname === 'localhost') {
          this.$store.commit('setProduction', false)
        }
        let passphrase = window.localStorage.getItem('passphrase')
        fetch(this.$store.getters.getApi + '/api/v2/stations', {
          method: 'GET'
        }).then(res => res.json()).then(res => {
          //console.log(res)
          this.$store.commit('setStations', res)
        })
        if (passphrase) {
          console.log('logged in')
          fetch(this.$store.getters.getApi + '/api/v2/login', {
            method: 'GET',
            headers: {
              Authorization: passphrase
            }
          }).then(res => res.json()).then(res => {
            console.log(res)
            if (res.user) {
              this.$store.commit('setKey', res.key)
              if (res.net) {
                this.$store.commit('neuralNet', res.net)
              }
              this.$router.push('/')

            } else {
              this.$router.push('/login')
            }
          })
          this.$store.commit('setPassphrase', passphrase)
        } else {
          this.$router.push('/welcome')
        }
      },
      getClosestStation() {
        if (this.$store.getters.getLocation) {

          const position = this.$store.getters.getLocation
          console.log('getting stations distance', position)
          if (position) {
            return this.$store.getters.getStations.sort((a, b) => {
              //console.log(getDistanceFromLatLonInKm(position.coords.latitude, position.coords.longitude, a.gtfs_latitude, a.gtfs_longitude), 'position', a.abbr)
              return getDistanceFromLatLonInKm(position.coords.latitude, position.coords.longitude, a.gtfs_latitude, a.gtfs_longitude) - getDistanceFromLatLonInKm(position.coords.latitude, position.coords.longitude, b.gtfs_latitude, b.gtfs_longitude)
            })
          } else {
            return false
          }


        } else {
          return false
        }
      },
      getLocation() {
        if (navigator.geolocation) {
          console.log('getting location')
          navigator.geolocation.getCurrentPosition(position => {
            console.log(position)
            this.$store.commit('setPosition', {
              coords: {
                accuracy: position.accuracy, latitude: position.latitude, longitude: position.longitude
              }, time: position.timestamp
            })
          });


        } else {
          return false
        }
      }
    }
  }
</script>

