<!-- eslint-disable vue/no-reserved-component-names -->
<template>
  <div class="flex flex-col items-center justify-center min-h-screen font-sans bg-blue-100">
    <div
      class="w-full p-6 bg-white border border-blue-200 rounded-lg shadow-lg mb-8"
      style="max-width: 1000px; margin: 0 auto"
    >
      <h1 class="text-4xl font-bold text-blue-700 mb-4">Weather Forecast</h1>
      <div class="relative inline-block text-left">
        <Menu>
          <MenuButton
            @click="toggleDropdown"
            class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            {{ selectedCity ? selectedCity : 'Select The City' }}
            <ChevronDownIcon class="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
          </MenuButton>
          <MenuItems
            v-if="isOpen"
            as="div"
            class="absolute mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          >
            <MenuItem
              v-for="(city, index) in cities"
              :key="index"
              :value="city"
              v-slot="{ active }"
            >
              <a
                href="#"
                @click="selectCity(city)"
                :class="[
                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                  'block px-4 py-2 text-sm'
                ]"
                >{{ city }}</a
              >
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>
      <Weather :city="selectedCity" />
    </div>
    <div
      class="w-full py-4 bg-blue-500 text-center rounded-t-lg"
      style="max-width: 1000px; margin: 0 auto"
    >
      <h3 class="text-xl font-bold text-white">Weather App</h3>
      <p class="text-white">by Ramesh Yoha</p>
    </div>
  </div>
</template>

<script>
import Weather from './components/Weather.vue'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'

export default {
  components: {
    Weather,
    // eslint-disable-next-line vue/no-reserved-component-names
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    ChevronDownIcon
  },
  data() {
    return {
      selectedCity: '',
      isOpen: false,
      cities: ['Select The City', 'Toronto', 'Ottawa', 'Tokyo']
    }
  },
  mounted() {
    document.addEventListener('click', this.closeDropdown)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.closeDropdown)
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen
    },
    closeDropdown(event) {
      if (!this.$el.contains(event.target)) {
        this.isOpen = false
      }
    },
    selectCity(city) {
      this.selectedCity = city
      if (city !== 'Select The City') {
        this.isOpen = false
      }
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap');

body {
  font-family: 'Poppins', sans-serif;
}
</style>
