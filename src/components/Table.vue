<template>
  <div
    v-if="weatherForecast"
    class="p-4 bg-white border border-blue-200 rounded-lg shadow-lg max-w-5xl mx-auto"
  >
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-blue-600 text-white">
          <tr>
            <th class="py-3 px-4 text-left text-sm font-semibold">Time</th>
            <th class="py-3 px-4 text-left text-sm font-semibold">Temp</th>
            <th class="py-3 px-4 text-left text-sm font-semibold">Min Temp</th>
            <th class="py-3 px-4 text-left text-sm font-semibold">Max Temp</th>
            <th class="py-3 px-4 text-left text-sm font-semibold">Wind</th>
            <th class="py-3 px-4 text-left text-sm font-semibold">Description</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="forecast in getListForDate(weatherForecast, selectedDate)"
            :key="forecast.Date"
            class="hover:bg-gray-50"
          >
            <td class="py-2 px-4 text-sm">{{ forecast.Date }}</td>
            <td class="py-2 px-4 text-sm">{{ forecast.Temp }}</td>
            <td class="py-2 px-4 text-sm">{{ forecast.MinTemp }}</td>
            <td class="py-2 px-4 text-sm">{{ forecast.MaxTemp }}</td>
            <td class="py-2 px-4 text-sm">{{ forecast.Wind }}</td>
            <td class="py-2 px-4 text-sm">{{ forecast.Description }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="mt-4 flex justify-center space-x-2">
      <button
        v-for="dayForecast in weatherForecast"
        :key="dayForecast.date"
        @click="selectDate(dayForecast.date)"
        :disabled="selectedDate === dayForecast.date"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ dayForecast.date }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TableComponent',

  props: ['weatherForecast'],

  data() {
    return {
      selectedDate:
        this.weatherForecast && this.weatherForecast.length > 0
          ? this.weatherForecast[0].date
          : null
    }
  },

  methods: {
    selectDate(date) {
      this.selectedDate = date
    },

    getListForDate(groupedForecast, targetDate) {
      const targetForecast = groupedForecast.find((item) => item.date === targetDate)
      return targetForecast ? targetForecast.list : []
    }
  }
}
</script>
