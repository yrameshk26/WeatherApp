<template>
  <div
    v-if="currentWeather"
    class="p-4 bg-white border border-blue-200 rounded-lg shadow-lg"
    style="max-width: 1000px; margin: 0 auto"
  >
    <div class="text-2xl font-semibold text-blue-700">{{ currentWeather.weather[0].main }}</div>
    <div class="text-blue-600">{{ currentWeather.weather[0].description }}</div>
    <br />
    <div class="text-xl font-bold text-blue-700">
      {{ formatTemperature(currentWeather.main.temp) }}
    </div>
    <div class="text-blue-600">Wind {{ currentWeather.wind.speed }} m/sec</div>

    <button
      @click="getWeatherForecast(cityId)"
      class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      {{ buttonName }}
    </button>
    <TableComponent
      v-if="tableOpened && weatherForecast"
      :weatherForecast="weatherForecast"
    ></TableComponent>
  </div>
</template>

<script>
import axios from 'axios'
import cities from '.././assets/cities.json'
import TableComponent from './Table.vue'
import { format } from 'date-fns'
import getOrCreateCache from '../util/cacheManager.js'

export default {
  name: 'WeatherComponent',

  components: {
    TableComponent
  },

  props: ['city'],

  data() {
    return {
      cityId: null,
      currentWeather: null,
      weatherForecast: null,
      tableOpened: false,
      buttonName: 'SEE FORECAST'
    }
  },

  watch: {
    city: {
      immediate: true,
      handler(newCity) {
        this.tableOpened = false
        this.buttonName = 'SEE FORECAST'
        if (newCity && !newCity.toLowerCase().startsWith('select')) {
          this.fetchCityId(newCity)
        } else {
          this.currentWeather = null
          this.weatherForecast = null
          this.cityId = null
        }
      }
    }
  },

  methods: {
    fetchCityId(cityName) {
      const cityData = cities.find((city) => city.name.toLowerCase() === cityName.toLowerCase())
      this.cityId = cityData ? cityData.id : null
      if (this.cityId) {
        this.getCurrentWeather(this.cityId)
      } else {
        this.currentWeather = null
      }
    },

    formatDateTime(dateTime) {
      return format(new Date(dateTime), 'dd MMM haaa')
    },

    formatDate(date) {
      return format(new Date(date), 'dd MMM')
    },

    formatTemperature(temperature) {
      return (temperature - 273.15).toFixed(1) + '°C'
    },

    getCurrentWeather(cityId) {
      const key = `currentWeather-${cityId}`
      const cache = getOrCreateCache(key, {
        max: parseInt(import.meta.env.VITE_MAX_CACHE_ITEMS),
        ttl: parseInt(import.meta.env.VITE_TTL)
      }) // Create or retrieve cache
      if (cache.has(key)) {
        console.log('Got from Cache')
        // Check if cache has data
        this.currentWeather = cache.get(key) // Retrieve data from cache
      } else {
        axios
          .get(
            `${import.meta.env.VITE_WEATHER_MAP_URL}weather?id=${cityId}&appid=${import.meta.env.VITE_WEATHER_MAP_APP_ID}`
          )
          .then((response) => {
            console.log('Called from API')
            this.currentWeather = response.data
            cache.set(key, response.data) // Store data in cache
          })
          .catch((error) => {
            console.log(error)
          })
      }
    },

    getWeatherForecast(cityId) {
      if (!this.tableOpened) {
        const key = `weatherForecast-${cityId}`
        const cache = getOrCreateCache(key, {
          max: parseInt(import.meta.env.VITE_MAX_CACHE_ITEMS),
          ttl: parseInt(import.meta.env.VITE_TTL)
        }) // Create or retrieve cache

        if (cache.has(key)) {
          console.log('Got from Cache')
          // Check if cache has data
          this.weatherForecast = cache.get(key) // Retrieve data from cache
        } else {
          axios
            .get(
              `${import.meta.env.VITE_WEATHER_MAP_URL}forecast?id=${cityId}&appid=${import.meta.env.VITE_WEATHER_MAP_APP_ID}`
            )
            .then((response) => {
              console.log('Called from API')
              this.weatherForecast = this.forecastByDay(response.data)
              cache.set(key, this.weatherForecast) // Store data in cache
            })
            .catch((error) => {
              console.log(error)
            })
        }

        this.tableOpened = !this.tableOpened
        this.buttonName = this.tableOpened ? 'CLOSE' : 'SEE FORECAST'
      }
    },

    forecastByDay(forecast) {
      if (!forecast) return []
      const groupedForecast = []
      forecast.list.forEach((forecastItem) => {
        const date = this.formatDate(forecastItem.dt_txt)

        let existingDateIndex = groupedForecast.findIndex((item) => item.date === date)

        if (existingDateIndex === -1) {
          groupedForecast.push({
            date,
            list: [
              {
                Date: this.formatDateTime(forecastItem.dt_txt),
                Temp: this.formatTemperature(forecastItem.main.temp),
                MinTemp: this.formatTemperature(forecastItem.main.temp_min),
                MaxTemp: this.formatTemperature(forecastItem.main.temp_max),
                Wind: forecastItem.wind.speed + ' m/sec',
                Description: forecastItem.weather[0].description
              }
            ]
          })
        } else {
          groupedForecast[existingDateIndex].list.push({
            Date: this.formatDateTime(forecastItem.dt_txt),
            Temp: this.formatTemperature(forecastItem.main.temp),
            MinTemp: this.formatTemperature(forecastItem.main.temp_min),
            MaxTemp: this.formatTemperature(forecastItem.main.temp_max),
            Wind: forecastItem.wind.speed + ' m/sec',
            Description: forecastItem.weather[0].description
          })
        }
      })

      return groupedForecast
    }
  }
}
</script>

<style scoped></style>
