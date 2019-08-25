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
      //this.$parent.apiURL = 'http://localhost:3000'
      this.suggestions = []
      this.$io.emit('requestApiKey', {pass: this.$parent.passphrase})
      this.searchText = ''
      if (this.$parent.appData) {

        if (this.$route.path === '/to') {
          this.mode = 'to'
          let reqBody = {
            passphrase: this.$parent.passphrase,
            position: this.$parent.position,
            station: this.$parent.appData.fromStation
          }
          console.log(this.$parent.apiURL + '/api/v1/suggestions/to')
          fetch(this.$parent.apiURL + '/api/v1/suggestions/to', {
            method: 'post',
            headers: {
              'Authorization': this.$parent.apiKey,
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(reqBody)
          }).then(res => res.json()).then(res => {
            //  console.log(res)
            //this.suggestions = res
            res.forEach(station => this.suggestions.push(station))
            this.loading = false
          })

        } else if (this.$route.path === '/from') {
          this.mode = 'from'
          let reqBody = {
            passphrase: this.$parent.passphrase,
            position: this.$parent.position
          }
          // console.log(reqBody)
          console.log(this.$parent.apiURL + '/api/v1/suggestions/from')
          fetch(this.$parent.apiURL + '/api/v1/suggestions/from', {
            method: 'post',
            headers: {
              'Authorization': this.$parent.apiKey,
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(reqBody)
          }).then(res => res.json()).then(res => {
            // console.log(res)
            res.forEach(station => this.suggestions.push(station))
            this.loading = false
          })
        }

      }
    },
    computed: {
      filteredStations() {
        return this.suggestions.filter((station) => {
          if (this.searchText.length > 1) {
            return station.name.toLowerCase().includes(this.searchText.toLowerCase())
          } else {
            return true
          }

        })
      },
    },
    methods: {

      setStation(station) {
        //  console.log(station)
        if (this.mode === 'from') {
          this.$io.emit('setFromStation', station)
        } else {
          this.$io.emit('setToStation', station)
        }
        this.$router.push('/')

      }
    }
  }
</script>