<template>

  <router-view/>

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
      let remoteConfig = this.$firebase.remoteConfig();
      remoteConfig.settings = {
        minimumFetchIntervalMillis: 3600000,
      };
      remoteConfig.fetch()

      remoteConfig.fetchAndActivate()
      .then(() => {
        const config = remoteConfig.getAll()
        console.log(config.apiurl['_value'], config.latestversion['_value'], config, 'config')
        this.$store.commit('apiUrl', config.apiurl['_value'])
        this.$store.commit('setLatestVersion', config.latestversion['_value'])
        if (config.latestversion['_value'] > this.version) {
          window.caches.keys().then(cacheNames => {
            cacheNames.forEach(cacheName => {
              caches.delete(cacheName);
            });
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });

      if (!navigator.onLine) { // true|false
        this.$swal({
          title: "No Connection",
          text: "While Arrival caches most of its resources offline, it requires an internet connection in order to load train data",
          icon: "warning",
          buttons: false,
          dangerMode: true,
          closeOnClickOutside: false
        })               // ...
      }
      window.addEventListener('online', () => {
        if (navigator.onLine) { // true|false
          this.$swal.close()
        }
        // Show a different icon based on offline/online
      });
      window.addEventListener('offline', () => {
        if (!navigator.onLine) { // true|false
          this.$swal({
            title: "No Connection",
            text: "While Arrival caches most of its resources offline, it requires an internet connection in order to load train data",
            icon: "warning",
            buttons: false,
            dangerMode: true,
            closeOnClickOutside: false,
            navigationWatch: false
          })               // ...
        }
        // Show a different icon based on offline/online
      });


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
        }).catch(err => {
          this.$swal({
            title: "Error connecting to Arrival backend",
            text: "While arrival downloads much of its resources, it still needs to connect to its backend in order to load train data",
            icon: "warning",
            buttons: false,
            dangerMode: true,
            closeOnClickOutside: false
          })
        })

        if (passphrase) {
          console.log('logged in')
          fetch(this.$store.getters.getApi + '/api/v2/login', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              Authorization: passphrase
            },
            body: JSON.stringify({clientVersion: this.version})
          }).then(res => res.json()).then(res => {
            console.log(res)
            if (res.user) {
              this.$store.commit('setKey', res.key)
              this.$store.commit('serverVersion', res.version)
              if (res.net) {
                this.$store.commit('neuralNet', res.net)
              }
              this.$router.push('/')
              this.navigationWatch = navigator.geolocation.watchPosition((position) => {
                  console.log(position, 'watched position')
                  this.$store.commit('setPosition', {
                    coords: {
                      accuracy: position.coords.accuracy,
                      latitude: position.coords.latitude,
                      longitude: position.coords.longitude
                    }, time: position.timestamp
                  })
                  const closestStations = this.getClosestStation()
                  this.$store.commit('setStations', closestStations)
                  console.log('updated closest stations')
                  if (this.$store.getters.fromStationThruClosest) {
                    this.$store.commit('setFromStation', closestStations[0])
                    console.log('updated from station thru geolocation', closestStations[0].abbr)
                  }
                }, (err) => {
                  console.error(err)
                }, {
                  enableHighAccuracy: false,
                  maximumAge: 0
                }
              );
            } else {
              this.$router.push('/login')
            }
          }).catch(err => {
            this.$swal({
              title: "Error connecting to Arrival backend",
              text: "While arrival downloads much of its resources, it still needs to connect to its backend in order to load train data",
              icon: "warning",
              buttons: false,
              dangerMode: true,
              closeOnClickOutside: false
            })
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
      }
    }
  }
</script>

