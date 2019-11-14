import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    net: false,
    fromStation: false,
    toStation: false,
    position: false,
    station: false,
    trains: false,
    passphrase: false,
    key: false,
    production: true,
    stations: [],
    apiUrl: 'https://api.arrival.city',
     testingUrl: 'https://api.arrival.city',
   // testingUrl: 'http://localhost:3000'
  },
  mutations: {
    setProduction(state, production) {
      state.production = production
    },
    setPassphrase(state, passphrase) {
      if (passphrase) {
        state.passphrase = passphrase
      } else {
        state.passphrase = false
      }
    },
    setPosition(state, position) {
      if (position) {
        state.position = position
      } else {
        state.position = false
      }
    },
    setKey(state, key) {
      if (key) {
        state.key = key
      } else {
        state.key = false
      }
    },
    setStations(state, stations) {
      state.stations = stations
    },
    setFromStation(state, station) {
      state.fromStation = station
    },
    setToStation(state, station) {
      state.toStation = station
    },
    neuralNet(state, net) {
      state.net = net
    }
  },
  actions: {},
  getters: {
    net(state) {
      return state.net
    },
    getStations(state) {
      return state.stations
    },
    production(state) {
      return state.production
    },
    getAuthentication(state) {
      if (state.passphrase) {
        return {
          key: state.key,
          passphrase: state.passphrase
        }
      } else {
        return false
      }

    },

    getLocation(state) {
      return state.position
    },
    getApi(state) {
      if (state.production) {
        return state.apiUrl
      } else {
        return state.testingUrl
      }

    },
    fromStation(state) {
      return state.fromStation
    },
    toStation(state) {
      return state.toStation
    }
  }
})
