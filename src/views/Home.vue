<template>
  <main class="page" style="margin: 0">
    <loader v-if="loading"></loader>
    <div class="page-heading">
      <h1>Trains <span class="text-xs font-light">v{{$parent.version}}</span> <span class="text-xs font-bold text-red"
                                                                                    v-if="outDated"> OUTDATED</span>
      </h1>
      <img @click="$router.push('/settings')" class="icon ml-auto w-6 mb-3" src="@/assets/icons/gear.svg">
    </div>
    <div class="home-locations">
      <router-link to="/from" class="locations-location">
        <p class="location-heading">from</p>
        <p class="location-value">{{fromStation.name}}</p>
      </router-link>
      <div class="locations-location text-center">
        <p class="location-heading">leaving now</p>
        <p v-if="false" class="location-value">now</p>
      </div>
      <router-link to="/to" class="locations-location text-right">
        <p class="location-heading">to</p>

        <p v-if="!toStation" class="location-value">Choose</p>
        <p v-if="toStation" class="location-value">{{toStation.name}}</p>
      </router-link>
    </div>
    <div v-if="toStation && trains.length > 0" class="home-trip">
      <div class="trip-time">
        <div class="trip-timeblock">
          <p class="timeblock-header">Depart</p>
          <p class="timeblock-time">{{trains[selectedTrain].originTime}}</p>
        </div>
        <p class="trip-enroute">{{trains[selectedTrain].enrouteTime}}<span>{{trains[selectedTrain].enrouteUnit}}</span>
        </p>
        <div class="trip-timeblock text-right">
          <p class="timeblock-header">Arrive</p>
          <p class="timeblock-time">{{trains[selectedTrain].destTime}}</p>
        </div>

      </div>
      <button v-if="false" class="btn">NOTIFY</button>
      <p v-if="false" class="desc text-center">tap to be notified 10m before your train departs</p>
      <p class="desc text-center">Soon you can receive alerts before your train departs</p>
    </div>
    <div class="home-schedule">
      <p class="text-xs text-grey">{{updated}}</p>
      <div v-if="trains.length === 0" v-for="skeleton in 3" class="schedule-train skeleton">
        <div class="train-color GREY"></div>
        <div class="train-line flex-grow-0 w-1/2">
          <p class="train-header GREY">line</p>
          <p class="line-value"></p>
        </div>
        <div class="train-data">
          <p class="train-header GREY">cars</p>
          <p class="data-value"></p>
        </div>
        <div class="train-data">
          <p class="train-header GREY">departs</p>
          <p class="data-value"></p>
        </div>

      </div>
      <div v-for="train in trains" class="schedule-train">
        <div v-if="train.details" class="train-color" :class="train.details.color"></div>
        <div class="train-line flex-grow-0 w-1/2">
          <p class="train-header">line</p>
          <p :class="{'text-xs': false}" class="line-value">{{train.destination}}</p>
        </div>
        <div v-if="train.details" class="train-data">
          <p class="train-header">cars</p>
          <p class="data-value">{{train.details.length}}</p>
        </div>
        <div v-if="train.etd" class="train-data">
          <p class="train-header">departs</p>
          <p class="data-value">{{train.etd}}<span v-if="train.etd != 'Leaving'"> min</span></p>
        </div>
        <div v-if="train.originTime" class="train-data">
          <p class="train-header">departs</p>
          <p class="data-value small">{{train.originTime}}</p>
        </div>
        <div v-if="train.destTime" class="train-data">
          <p class="train-header">arrives</p>
          <p class="data-value small">{{train.destTime}}</p>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
  import loader from '../components/loader'

  function versionCompare(v1, v2, options) {
    var lexicographical = options && options.lexicographical,
      zeroExtend = options && options.zeroExtend,
      v1parts = v1.split('.'),
      v2parts = v2.split('.');

    function isValidPart(x) {
      return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
    }

    if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
      return NaN;
    }

    if (zeroExtend) {
      while (v1parts.length < v2parts.length) v1parts.push("0");
      while (v2parts.length < v1parts.length) v2parts.push("0");
    }

    if (!lexicographical) {
      v1parts = v1parts.map(Number);
      v2parts = v2parts.map(Number);
    }

    for (var i = 0; i < v1parts.length; ++i) {
      if (v2parts.length == i) {
        return 1;
      }

      if (v1parts[i] == v2parts[i]) {
        continue;
      } else if (v1parts[i] > v2parts[i]) {
        return 1;
      } else {
        return -1;
      }
    }

    if (v1parts.length != v2parts.length) {
      return -1;
    }

    return 0;
  }

  export default {
    name: 'home',
    components: {loader},
    data() {
      return {
        fromStation: 'none',
        user: {},
        trains: [],
        updated: '',
        toStation: false,
        loading: true,
        selectedTrain: 0
      }
    },
    mounted() {
      if (this.$store.getters.fromStation) {
        this.fromStation = this.$store.getters.fromStation
        console.log(this.fromStation)
        this.loading = false
      }
      if (this.$store.getters.toStation) {
        this.toStation = this.$store.getters.toStation
        console.log(this.toStation)
      }
      this.user = this.$store.getters.getAuthentication
      if (this.user) {
        console.log('getting location')
        if (this.$parent.production) {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
              console.log(position)
              this.$store.commit('setPosition', {
                coords: {
                  accuracy: position.coords.accuracy,
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude
                }, time: position.timestamp
              })
              const closestStations = this.$parent.getClosestStation()

              this.$store.commit('setStations', closestStations)
              if (!this.$store.getters.fromStation) {
                this.fromStation = closestStations[0]
                this.$store.commit('setFromStation', closestStations[0])
                console.log(closestStations[0])
              } else {
                this.fromStation = this.$store.getters.fromStation
                console.log(this.fromStation)
              }
              this.loading = false
              this.refresh()
              let refreshInterval = setInterval(() => {
                // console.log('going')
                this.refresh()
              }, 30000)
            }, (error) => {
              console.log(error)
              if (error.code === 1) {
                this.$swal({
                  title: "Location Access",
                  text: "In order to load suggestions Arrival needs access to your location. Please turn on location access.",
                  icon: "warning",
                  buttons: false,
                  dangerMode: true,
                })
              }
            })
          } else {
            this.$swal({
              title: "Location Access",
              text: "In order to load suggestions Arrival needs access to your location. Please turn on location access.",
              icon: "warning",
              buttons: false,
              dangerMode: true,
            })
          }
        } else {
          const position = {
            coords: {
              accuracy: 100,
              latitude: 37.562992,
              longitude: -122.325523
            }
          }
          this.$store.commit('setPosition', {
            coords: {
              accuracy: position.coords.accuracy,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }, time: position.timestamp
          })
          const closestStations = this.$parent.getClosestStation()

          this.$store.commit('setStations', closestStations)
          if (!this.$store.getters.fromStation) {
            this.fromStation = closestStations[0]
            this.$store.commit('setFromStation', closestStations[0])
            console.log(closestStations[0])
          } else {
            this.fromStation = this.$store.getters.fromStation
            console.log(this.fromStation)
          }
          this.loading = false
          this.refresh()
          let refreshInterval = setInterval(() => {
            // console.log('going')
            this.refresh()
          }, 30000)
        }


      } else {
        this.$router.push('/login')
      }
    },
    computed: {
      latestVersion() {
        return this.$store.getters.latestVersion
      },
      outDated() {
        console.log(versionCompare(this.$parent.version, String(this.$store.getters.latestVersion)), this.$parent.version, this.$store.getters.latestVersion)
        return versionCompare(this.$parent.version, String(this.$store.getters.latestVersion)) === -1
      }
    },
    methods: {
      refresh() {
        console.log('refreshing')
        this.loading = false
        if (this.toStation) {
          fetch(this.$store.getters.getApi + `/api/v2/routes/${this.fromStation.abbr}/${this.toStation.abbr}`, {
            method: 'GET',
            headers: {
              Authorization: this.user.passphrase
            }
          }).then(res => res.json()).then(res => {
            console.log(res)
            this.trains = res.trips.map(i => {

              const result = {
                destination: i.leg[0]['@trainHeadStation'],
                destTime: this.$moment(i.leg[0]['@destTimeMin'], 'HH:mm A').format('h:mm'),
                originTime: this.$moment(i.leg[0]['@origTimeMin'], 'HH:mm A').format('h:mm'),
                enrouteTime: this.$moment(i.leg[0]['@destTimeMin'], 'HH:mm A').diff(this.$moment(i.leg[0]['@origTimeMin'], 'HH:mm A'), 'minutes'),
                enrouteUnit: 'min'
              }
              return result
            })
            this.loading = false
          })
        } else {
          fetch(this.$store.getters.getApi + `/api/v2/trains/${this.fromStation.abbr}`, {
            method: 'GET',
            headers: {
              Authorization: this.user.passphrase
            }
          }).then(res => res.json()).then(res => {
            console.log(res)
            this.updated = res.time
            this.trains = res.estimates.etd.map(i => {
              let result = {
                abbreviation: i.abbreviation,
                details: i.estimate[0],
                etd: i.estimate[0].minutes,
                destination: i.destination
              }

              return result
            }).sort((a, b) => {
              let conversionA = a.etd
              let conversionB = b.etd
              if (a.etd == 'Leaving') {
                conversionA = -1

              } else {

              }
              if (b.etd == 'Leaving') {
                conversionB = -1

              } else {

              }
              return conversionA - conversionB
            })
            this.loading = false

          })
        }


      }
    }
  }
</script>
