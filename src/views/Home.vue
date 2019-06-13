<template>
  <main v-if="$parent.appData" class="page">
    <div class="page-heading">
      <h1>Trains</h1>
      <img @click="$router.push('/settings')" class="icon ml-auto w-6 mb-3" src="@/assets/icons/gear.svg">
    </div>
    <div class="home-locations">
      <div  @click="$router.push('/search')" class="locations-location">
        <p class="location-heading">from</p>
        <p class="location-value">{{$parent.appData.fromStation.name}}</p>
      </div>
      <div class="locations-location text-center">
        <p class="location-heading">{{$parent.appData.calcTime.type}}</p>
        <p class="location-value">{{$parent.appData.calcTime.time}}</p>
      </div>
      <div @click="$router.push('/search')" class="locations-location text-right">
        <p class="location-heading">to</p>
        <p v-if="$parent.appData.toStation" class="location-value">{{$parent.appData.toStation.name}}</p>
        <p v-if="!$parent.appData.toStation" class="location-value">Choose</p>
      </div>
    </div>
    <div v-if="$parent.appData.trip" class="home-trip">
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
      <div v-for="train in $parent.appData.trains" class="schedule-train">
        <div class="train-color"></div>
        <div class="train-line">
          <p class="train-header">line</p>
          <p class="line-value">{{train.destination}}</p>
        </div>
        <div class="train-data">
          <p class="train-header">cars</p>
          <p class="data-value">{{train.cars}}</p>
        </div>
        <div class="train-data">
          <p class="train-header">departs</p>
          <p class="data-value">{{train.etd.value}}<span>{{train.etd.unit}}</span></p>
        </div>
        <div v-if="train.arrives" class="train-data">
          <p class="train-header">arrives</p>
          <p class="data-value">12:40pm</p>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
  export default {
    name: 'home'
  }
</script>
