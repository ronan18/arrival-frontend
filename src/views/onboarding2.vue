<template>
  <main class="page onBoarding">

    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="280" height="128.375" viewBox="0 0 280 128.375">
      <defs>
        <filter id="Rectangle_3" x="8.5" y="36" width="263" height="92.375" filterUnits="userSpaceOnUse">
          <feOffset dy="3" input="SourceAlpha"/>
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feFlood flood-opacity="0.161"/>
          <feComposite operator="in" in2="blur"/>
          <feComposite in="SourceGraphic"/>
        </filter>
      </defs>
      <rect id="Rectangle_2" data-name="Rectangle 2" width="280" height="57.75" fill="#0c1319"/>
      <text id="from" transform="translate(17.5 14.75)" fill="#fff" font-size="6" font-family="HelveticaNeue-Light, Helvetica Neue" font-weight="300"><tspan x="0" y="0">from</tspan></text>
      <text id="to" transform="translate(210.875 14.75)" fill="#fff" font-size="6" font-family="HelveticaNeue-Light, Helvetica Neue" font-weight="300"><tspan x="0" y="0">to</tspan></text>
      <text id="Balboa_Park" data-name="Balboa Park" transform="translate(17.5 27.5)" fill="#fff" font-size="10" font-family="HelveticaNeue-Bold, Helvetica Neue" font-weight="700"><tspan x="0" y="0">Balboa Park</tspan></text>
      <text id="Rockridge" transform="translate(210.875 27.5)" fill="#fff" font-size="10" font-family="HelveticaNeue-Bold, Helvetica Neue" font-weight="700"><tspan x="0" y="0">Rockridge</tspan></text>
      <g transform="matrix(1, 0, 0, 1, 0, 0)" filter="url(#Rectangle_3)">
        <rect id="Rectangle_3-2" data-name="Rectangle 3" width="245" height="74.375" rx="5" transform="translate(17.5 42)" fill="#fff"/>
      </g>
      <text id="Depart" transform="translate(35.875 68.375)" fill="#007aff" font-size="8" font-family="HelveticaNeue-Bold, Helvetica Neue" font-weight="700"><tspan x="0" y="0">Depart</tspan></text>
      <text id="Arrive" transform="translate(189.875 68.375)" fill="#007aff" font-size="8" font-family="HelveticaNeue-Bold, Helvetica Neue" font-weight="700"><tspan x="0" y="0">Arrive</tspan></text>
      <text id="_9:33" data-name="9:33" transform="translate(35.875 89.125)" fill="#0c1319" font-size="21" font-family="HelveticaNeue-Bold, Helvetica Neue" font-weight="700"><tspan x="0" y="0">9:33</tspan></text>
      <text id="_55min" data-name="55min" transform="translate(126.875 85.5)" fill="#0c1319" font-size="12" font-family="HelveticaNeue-Bold, Helvetica Neue" font-weight="700"><tspan x="0" y="0">55</tspan><tspan y="0" font-size="8" font-family="HelveticaNeue-Light, Helvetica Neue" font-weight="300">min</tspan></text>
      <text id="_10:43" data-name="10:43" transform="translate(189.875 89.125)" fill="#0c1319" font-size="21" font-family="HelveticaNeue-Bold, Helvetica Neue" font-weight="700"><tspan x="0" y="0">10:43</tspan></text>
      <line id="Line_1" data-name="Line 1" x2="35" transform="translate(82.688 81.813)" fill="none" stroke="#707070" stroke-width="1"/>
      <line id="Line_2" data-name="Line 2" x2="27.125" transform="translate(159.688 81.813)" fill="none" stroke="#707070" stroke-width="1"/>
    </svg>

    <h1>Choose A Destination</h1>
    <p>Arrival will automatically learn which stations you frequent and when, making it faster and easier for you to figure out ETAs</p>
    <router-link to="/featureSchedule" class="btn">WOW! TELL ME MORE!</router-link>
  </main>
</template>