<template>
  <nav class="w-full flex justify-between items-center bg-yellow-400 px-10 py-5 shadow-sm">
    <p class="text-xl"><nuxt-link to="/">Welcome</nuxt-link> "{{ username }}"</p>
    <button @click="logout"
            class="px-5 py-2 rounded-3xl border border-gray-500 focus:outline-none hover:bg-gray-200 transition duration-300">Logout
    </button>
  </nav>
</template>

<script>
  export default {
    name: 'Navbar',
    data () {
      return {
        username: ''
      }
    },
    methods: {
      async logout () {
        await this.$auth.logout()
      }
    },
    async fetch() {
      this.username = this.$auth.user.username
    }
  }
</script>

<style scoped>

</style>
