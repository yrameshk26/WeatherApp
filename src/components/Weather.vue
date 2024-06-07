<template>
  <div>
    <div
      v-if="errorMessage"
      class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
      role="alert"
    >
      {{ errorMessage }}
    </div>
    <div
      v-if="currentWeather"
      class="p-4 bg-white border border-blue-200 rounded-lg shadow-lg"
      style="max-width: 1000px; margin: 0 auto"
    >
      <div class="text-2xl font-semibold text-blue-700">{{ currentWeather.weather[0].main }}</div>
      <div class="text-blue-600">{{ currentWeather.weather[0].description }}</div>
      <br />
      <div class="text-xl font-bold text-blue-700">
        {{ this.formatTemperature(this.currentWeather.main.temp) }}
      </div>
      <div class="text-blue-600">Wind {{ currentWeather.wind.speed }} m/sec</div>

      <button
        @click="toggleForecast"
        class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        {{ buttonLabel }}
      </button>
      <TableComponent
        v-if="isForecastVisible && weatherForecast"
        :weatherForecast="formattedForecast"
      ></TableComponent>
    </div>
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
      isForecastVisible: false,
      buttonLabel: 'SEE FORECAST',
      errorMessage: ''
    }
  },

  watch: {
    city: {
      immediate: true,
      handler(newCity) {
        this.isForecastVisible = false
        this.buttonLabel = 'SEE FORECAST'
        this.resetData()
        if (newCity && !newCity.toLowerCase().startsWith('select')) {
          this.fetchCityId(newCity)
        }
      }
    }
  },

  computed: {
    formattedForecast() {
      if (!this.weatherForecast) return []
      return this.weatherForecast.map((day) => ({
        ...day,
        list: day.list.map((item) => ({
          Date: this.formatDateTime(item.dt_txt),
          Temp: this.formatTemperature(item.main.temp),
          MinTemp: this.formatTemperature(item.main.temp_min),
          MaxTemp: this.formatTemperature(item.main.temp_max),
          Wind: `${item.wind.speed} m/sec`,
          Description: item.weather[0].description
        }))
      }))
    }
  },

  methods: {
    async fetchCityId(cityName) {
      const cityData = cities.find((city) => city.name.toLowerCase() === cityName.toLowerCase())
      this.cityId = cityData ? cityData.id : null
      if (this.cityId) await this.getCurrentWeather(this.cityId)
    },
    async getCurrentWeather(cityId) {
      const key = `currentWeather-${cityId}`
      const cache = getOrCreateCache(key, {
        max: parseInt(import.meta.env.VITE_MAX_CACHE_ITEMS),
        ttl: parseInt(import.meta.env.VITE_TTL)
      })
      if (cache.has(key)) {
        this.currentWeather = cache.get(key)
      } else {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_WEATHER_MAP_URL}weather?id=${cityId}&appid=${import.meta.env.VITE_WEATHER_MAP_APP_ID}`
          )
          this.currentWeather = response.data
          cache.set(key, response.data)
        } catch (error) {
          this.handleError('Failed to fetch current weather data.')
        }
      }
    },
    async fetchWeatherForecast(cityId) {
      console.log('test')
      console.log(import.meta.env.VITE_MAX_CACHE_ITEMS)
      console.log(import.meta.env.VITE_TTL)
      const key = `weatherForecast-${cityId}`
      const cache = getOrCreateCache(key, {
        max: parseInt(import.meta.env.VITE_MAX_CACHE_ITEMS),
        ttl: parseInt(import.meta.env.VITE_TTL)
      })
      if (cache.has(key)) {
        this.weatherForecast = cache.get(key)
      } else {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_WEATHER_MAP_URL}forecast?id=${cityId}&appid=${import.meta.env.VITE_WEATHER_MAP_APP_ID}`
          )
          this.weatherForecast = this.groupForecastByDay(response.data)
          cache.set(key, this.weatherForecast)
        } catch (error) {
          this.handleError('Failed to fetch weather forecast data.')
        }
      }
    },
    handleError(message) {
      this.errorMessage = message
      setTimeout(() => {
        this.errorMessage = ''
      }, 3000)
    },
    formatDateTime(dateTime) {
      return format(new Date(dateTime), 'dd MMM haaa')
    },
    formatTemperature(temperature) {
      return `${(temperature - 273.15).toFixed()}°C`
    },
    groupForecastByDay(forecast) {
      if (!forecast) return []
      const groupedForecast = []
      forecast.list.forEach((forecastItem) => {
        const date = format(new Date(forecastItem.dt_txt), 'dd MMM')
        const existingDay = groupedForecast.find((day) => day.date === date)
        if (existingDay) {
          existingDay.list.push(forecastItem)
        } else {
          groupedForecast.push({ date, list: [forecastItem] })
        }
      })
      return groupedForecast
    },
    toggleForecast() {
      this.isForecastVisible = !this.isForecastVisible
      this.buttonLabel = this.isForecastVisible ? 'CLOSE' : 'SEE FORECAST'
      if (this.isForecastVisible && this.cityId) {
        this.fetchWeatherForecast(this.cityId)
      }
    },
    resetData() {
      this.currentWeather = null
      this.weatherForecast = null
      this.isForecastVisible = false
      this.buttonLabel = 'SEE FORECAST'
      this.cityId = null
      this.errorMessage = ''
    }
  }
}
</script>
