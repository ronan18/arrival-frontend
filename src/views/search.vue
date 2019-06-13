<template>
  <main class="page search">
    <div class="page-heading">
      <img @click="$router.push('/')" class="icon -mr-2 w-10 mb-0 -ml-3" src="@/assets/icons/back.svg">
      <input v-focus autofocus="true" type="text" placeholder="Station">
    </div>

    <p class="font-bold text-grey text-xs m-3">suggested</p>
    <div class="search-suggestions">
      <div v-for="i in [1,2,3,4,5,6,7]" class="search-suggestion">
        <p class="suggestion-station">Rockridge</p>
        <div class="suggestion-data">
          <p class="data-header">next train in</p>
          <p class="data-value">10<span>min</span></p>
        </div>
        <div class="suggestion-data">
          <p class="data-header">walking time</p>
          <p class="data-value">5<span>min</span></p>
        </div>

      </div>
    </div>
  </main>
</template>