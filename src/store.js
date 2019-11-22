import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    fromStationThruClosest: true,
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
    latestVersion: 0,
    serverVersion: 0,
    apiUrl: 'https://api.arrival.city',
    testingUrl: 'https://api.arrival.city',
    // testingUrl: 'http://localhost:3000'
  },
  mutations: {
    serverVersion(state, version) {
      state.serverVersion = version
    },
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
    setLatestVersion(state, version) {
      state.latestVersion = version
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
    },
    apiUrl(state, url) {
      state.apiUrl = url
    },
    disableFromStationThruClosest(state) {
      state.fromStationThruClosest = false
    }
  },
  actions: {},
  getters: {
    fromStationThruClosest(state) {
      return state.fromStationThruClosest
    },
    serverVersion(state) {
      return state.serverVersion
    },
    latestVersion(state) {
      return state.latestVersion
    },
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
