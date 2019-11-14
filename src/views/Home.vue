<template>
  <main class="page">
    <div class="page-heading">
      <h1>Trains <span class="text-xs font-light">{{$parent.version}}</span></h1>
      <img class="icon ml-auto w-6 mb-3" src="@/assets/icons/gear.svg">
    </div>
    <div class="home-locations">
      <router-link to="/from" class="locations-location">
        <p class="location-heading">from</p>
        <p class="location-value">{{fromStation.name}}</p>
      </router-link>
      <div class="locations-location text-center">
        <p class="location-heading">Leave</p>
        <p class="location-value">now</p>
      </div>
      <router-link to="/to" class="locations-location text-right">
        <p class="location-heading">to</p>

        <p v-if="!toStation" class="location-value">Choose</p>
        <p v-if="toStation" class="location-value">{{toStation.name}}</p>
      </router-link>
    </div>
    <div v-if="false" class="home-trip">
      <div class="trip-time">
        <div class="trip-timeblock">
          <p class="timeblock-header">Depart</p>
          <p class="timeblock-time">9:33</p>
        </div>
        <p class="trip-enroute">55<span>min</span></p>
        <div class="trip-timeblock text-right">
          <p class="timeblock-header">Depart</p>
          <p class="timeblock-time">9:33</p>
        </div>

      </div>
      <button class="btn">NOTIFY</button>
      <p class="desc text-center">tap to be notified 10m before your train departs</p>
    </div>
    <div class="home-schedule">
      <p class="text-xs text-grey">{{updated}}</p>
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
          <p class="data-value">{{train.etd}}<span> min</span></p>
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
  export default {
    name: 'home',
    data() {
      return {
        fromStation: 'none',
        user: {},
        trains: [],
        updated: 'none',
        toStation: false
      }
    },
    mounted() {
      if (this.$store.getters.fromStation) {
        this.fromStation = this.$store.getters.fromStation
        console.log(this.fromStation)
      }
      if (this.$store.getters.toStation) {
        this.toStation = this.$store.getters.toStation
        console.log(this.toStation)
      }
      this.user = this.$store.getters.getAuthentication
      if (this.user) {
        console.log('getting location')
        if (this.$parent.production) {
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

            this.refresh()
            let refreshInterval = setInterval(() => {
              // console.log('going')
              this.refresh()
            }, 30000)
          })
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
    methods: {
      refresh() {
        console.log('refreshing')
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
                destTime: i['@destTimeMin'],
                originTime: i['@origTimeMin']
              }
              return result
            })
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

          })
        }


      }
    }
  }
</script>
