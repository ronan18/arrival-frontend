<template>
  <main class="page">
    <div class="page-heading">
      <h1>Trains</h1>
      <img class="icon" src="@/assets/icons/gear.svg">
    </div>
    <div class="home-locations">
      <div class="locations-location">
        <p class="location-heading">from</p>
        <p class="location-value">Balboa Park</p>
      </div>
      <div class="locations-location text-center">
        <p class="location-heading">leave</p>
        <p class="location-value">Now</p>
      </div>
      <div class="locations-location text-right">
        <p class="location-heading">to</p>
        <p class="location-value">Rockridge</p>
      </div>
    </div>
    <div class="home-trip">
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
      <div v-for="i in [1,2,3,4,5,6,7]" class="schedule-train">
        <div class="train-color"></div>
        <div class="train-line">
          <p class="train-header">line</p>
          <p class="line-value">Antioch</p>
        </div>
        <div class="train-data">
          <p class="train-header">cars</p>
          <p class="data-value">10</p>
        </div>
        <div class="train-data">
          <p class="train-header">departs</p>
          <p class="data-value">10:30am</p>
        </div>
        <div class="train-data">
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
