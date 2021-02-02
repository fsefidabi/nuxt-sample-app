<template>
  <div class="flex">
    <div class="side-photo w-1/3 h-screen bg-cover shadow-xl"></div>
    <div class="w-2/3 flex flex-col items-center">
      <div class="self-end flex items-center m-10 text-sm">
        <p class="font-hairline">Not a member?</p>
        <button
          class="ml-3 py-1 px-4 rounded-2xl border border-gray-300 shadow-sm focus:outline-none">
          <NuxtLink to="/register">Sign Up</NuxtLink>
        </button>
      </div>
      <div class="w-5/12 mt-8">
        <h2 class="text-2xl text-gray-800">Login</h2>
        <form @submit.prevent="login" class="mt-12">
          <div class="flex items-center mt-5 py-3 px-5 rounded-md border border-gray-600">
            <i class="gg-user text-gray-400 text-sm"></i>
            <input v-model="username" type="text" placeholder="Username"
                   class="w-full ml-6 focus:outline-none">
          </div>

          <div class="flex items-center mt-5 py-3 px-5 rounded-md border border-gray-600">
            <i class="gg-lock text-gray-400 text-sm"></i>
            <input v-model="password" type="password" placeholder="Password"
                   class="w-full ml-6 focus:outline-none">
          </div>
          <ButtonComponent button-text="Sign In"/>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Login',
    middleware: 'loggedIn',
    data() {
      return{
        username: '',
        password: ''
      }
    },
    methods: {
      async login () {
        try {
          await this.$auth.loginWith('local', {
            data: {
              identifier: this.username,
              password: this.password
            }
          })
        } catch (err) {
          console.log(err)
        }
      }
    }
  }
</script>

<style scoped>
  .side-photo {
    background-image: url("../assets/images/yellow-desk-002.jpg");
  }

  .gg-user {
    --ggs: 0.8
  }

  .gg-lock {
    --ggs: 0.6
  }
</style>
