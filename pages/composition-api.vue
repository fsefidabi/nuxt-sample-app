<template>
  <div class="flex flex-col justify-center items-center">
    <Navbar />
    <div class="w-3/4 mt-12 text-center">
      <h1 class="text-xl font-bold mb-5">Written with <span class="text-red-700">Composition API Module</span></h1>
      <p>{{state.text}}</p>
      <hr class="my-12" />
      <p class="mb-5">Click on the bellow button to change the color of the box.</p>
      <div class="flex flex-col items-center justify-center">
        <button v-if="state.active.value" @click="changeColor"
                class="w-24 px-6 py-2 rounded-3xl bg-gray-800 text-white focus:outline-none">Green
        </button>
        <button v-if="!state.active.value" @click="changeColor"
                class="w-24 px-6 py-2 rounded-3xl bg-gray-800 text-white focus:outline-none">Blue
        </button>
        <div class="w-48 h-48 mt-1 rounded-3xl border "
             :class="[state.active.value === false ? 'bg-green-600' : 'bg-blue-600']"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import { ssrRef } from '@nuxtjs/composition-api'
  import Navbar from '../components/Navbar'
  export default {
    name: 'composition-api',
    components: {Navbar},
    head () {
      return {
        title: 'composition api',
        meta: [
          {
            hid: 'description',
            name: 'description',
            content:
              'Testing vue-meta performance in Nuxt.js app.'
          }
        ]
      }
    },
    setup() {
      const state = {
        text:
          'This sentence is coming from "state" of composition api module to test if it works correctly.',
        active: ssrRef(false)
      }

      function changeColor () {
        state.active.value = !state.active.value
        console.log(state.active.value)
      }

      return {
        state,
        changeColor
      }
    }
  }
</script>

<style scoped>

</style>
