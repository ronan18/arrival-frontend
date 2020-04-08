<template>
  <main class="page search">
    <div class="page-heading">
      <img @click="$router.push('/')" class="icon -mr-2 w-10 mb-0 -ml-3" src="@/assets/icons/back.svg">
      <input v-model="searchText" v-focus autofocus="true" type="text" placeholder="Station">
    </div>

    <p class="font-bold text-grey text-xs m-3">suggested</p>
    <div v-if="suggestions" class="search-suggestions">
      <div v-if="loading" class="search-suggestion text-center">
        <h1 class="font-bold text-center ml-auto mr-auto">Suggestions Loading</h1>
      </div>
      <div @click="setStation(false)" v-if="mode === 'to'" class="search-suggestion">
        <p class="suggestion-station">None</p>
      </div>
      <div @click="setStation(station)" v-for="station in filteredStations" class="search-suggestion">
        <p class="suggestion-station">{{station.name}}</p>
        <div v-if="station.nextTrain" class="suggestion-data">
          <p class="data-header">next train in</p>
          <p class="data-value">10<span>min</span></p>
        </div>
        <div v-if="station.walkingTime" class="suggestion-data">
          <p class="data-header">walking time</p>
          <p class="data-value">5<span>min</span></p>
        </div>

      </div>
    </div>
  </main>
</template>
<script>
  import brain from 'brain.js'

  const moment = require('moment')
  export default {
    name: 'search',
    data() {
      return {
        mode: false,
        suggestions: [],
        searchText: '',
        loading: true
      }
    },
    mounted() {
      this.loading = true
      if (this.$route.path === '/to') {
        this.mode = 'to'
        if (this.$store.getters.net) {

          const net = new brain.NeuralNetwork()
          net.fromJSON(this.$store.getters.net);
          const time = Date.now()
          let resultsArray = []
          let resultStations = []
          const result = net.run({
            day: moment(time).day() / 10,
            hour: moment(time).hour() / 100,
            [this.$store.getters.fromStation.abbr]: 1
          })
          console.log(result)
          for (const key in result) {
            if (result.hasOwnProperty(key) && this.$store.getters.fromStation.abbr !== key) {
              resultStations.push(key)
              let stationData = this.$store.getters.getStations.filter(obj => {
                return obj.abbr === key
              })[0]
              stationData.priority = result[key]
              resultsArray.push(stationData)
            }
          }
          resultsArray = resultsArray.sort((a, b) => {
            return b.priority - a.priority
          })
          this.$store.getters.getStations.forEach(i => {
            if (resultStations.indexOf(i.abbr) === -1 && this.$store.getters.fromStation.abbr !== i.abbr) {
              resultsArray.push(i)
            }
          })
          console.log(resultsArray)
          this.suggestions = resultsArray
        } else {
          this.suggestions = this.$store.getters.getStations.filter(item => {
            //   console.log(item.abbr, this.$store.getters.fromStation.abbr)
            return item.abbr !== this.$store.getters.fromStation.abbr
          })
        }


        this.loading = false
      } else {
        this.mode = 'from'
        if (this.$store.getters.fromNet && false) {
//TODO FIX THIS NOT SURE IT WORKS
          const net = new brain.NeuralNetwork()
          net.fromJSON(this.$store.getters.fromNet);
          const time = Date.now()
          let resultsArray = []
          let resultStations = []
          const result = net.run({
            day: moment(time).day() / 10,
            hour: moment(time).hour() / 100,
            [this.$store.getters.getStations[0].abbr]: 1
          })
          console.log(result)
          for (const key in result) {
            if (result.hasOwnProperty(key)) {
              resultStations.push(key)
              let stationData = this.$store.getters.getStations.filter(obj => {
                return obj.abbr === key
              })[0]
              stationData.priority = result[key]
              resultsArray.push(stationData)
            }
          }
          resultsArray = resultsArray.sort((a, b) => {
            return b.priority - a.priority
          })
          this.$store.getters.getStations.forEach(i => {
            if (resultStations.indexOf(i.abbr) === -1 && this.$store.getters.fromStation.abbr !== i.abbr) {
              resultsArray.push(i)
            }
          })
          console.log(resultsArray)
          this.suggestions = resultsArray
        } else {
          this.suggestions = this.$store.getters.getStations.filter(item => {
            //   console.log(item.abbr, this.$store.getters.fromStation.abbr)
            return item.abbr !== this.$store.getters.fromStation.abbr
          })
        }
        this.loading = false
      }
    },
    computed: {
      filteredStations() {
        if (this.searchText.length > 1) {
          return this.suggestions.filter((station) => {

            return station.name.toLowerCase().includes(this.searchText.toLowerCase())


          })
        } else {
          return this.suggestions
        }
      },
    },
    methods: {
      setStation(station) {
        if (this.mode === 'from') {
          this.$store.commit('setFromStation', station)
          if (station.abbr != this.$store.getters.getStations[0].abbr) {
            fetch(this.$store.getters.getApi + '/api/v2/fromstationdata', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                user: this.$store.getters.getAuthentication.passphrase,
                fromStation: station.abbr,
                location: this.$store.getters.getLocation,
                closestStation: this.$store.getters.getStations[0].abbr
              })
            }).then(res => res.json()).then(res => {
              console.log(res, 'updated from trips')
            })
          }

          this.$store.commit('disableFromStationThruClosest')
          this.$router.push('/')
        } else if (this.mode === 'to') {
          this.$store.commit('setToStation', station)


          if (station) {
            console.log('updating trips')
            fetch(this.$store.getters.getApi + '/api/v2/addStationData', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                user: this.$store.getters.getAuthentication.passphrase,
                toStation: station,
                fromStation: this.$store.getters.fromStation,
              })
            }).then(res => res.json()).then(res => {
              console.log(res, 'updated trips')
            })
          }
          this.$router.push('/')
        }

      }
    }
  }
</script>