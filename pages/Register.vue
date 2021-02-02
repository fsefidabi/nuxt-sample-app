<template>
  <div class="flex">
    <div class="side-photo w-1/3 h-screen bg-cover shadow-xl"></div>
    <div class="w-2/3 flex flex-col items-center">
      <div class="self-end flex items-center m-10 text-sm">
        <p class="font-hairline">Already have an account?</p>
        <NuxtLink to="/login">
          <button
            class="ml-3 py-1 px-4 rounded-2xl border border-gray-300 shadow-sm hover:bg-yellow focus:outline-none">
            Sign In
          </button>
        </NuxtLink>
      </div>
      <div class="w-5/12">
        <h2 class="text-2xl text-gray-800">Register</h2>
        <p class="font-light text-sm mt-2">Enter your details below.</p>
        <form method="post" @submit.prevent="register" class="mt-12">
          <div class="flex items-center mt-5 py-3 px-5 rounded-md border border-gray-600">
            <i class="gg-user text-gray-400 text-sm"></i>
            <input v-model="username" type="text" placeholder="Username" class="w-full ml-6 focus:outline-none">
          </div>

          <div class="flex items-center mt-5 py-3 px-5 rounded-md border border-gray-600">
            <i class="gg-mail text-gray-400 text-sm"></i>
            <input v-model="email" type="email" placeholder="Email" class="w-full ml-6 focus:outline-none">
          </div>

          <div class="flex items-center mt-5 py-3 px-5 rounded-md border border-gray-600">
            <i class="gg-lock text-gray-400 text-sm"></i>
            <input v-model="password" type="password" placeholder="Password" class="w-full ml-6 focus:outline-none">
          </div>

          <div class="flex items-center mt-5 py-3 px-5 rounded-md border border-gray-600">
            <i class="gg-lock text-gray-400 text-sm"></i>
            <input v-model="passwordConfirm" type="password" placeholder="Confirm Password"
                   class="w-full ml-6 focus:outline-none">
          </div>
          <ButtonComponent button-text="Sign Up"/>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Register',
    middleware: 'loggedIn',
    data () {
      return {
        username: '',
        email: '',
        password: '',
        passwordConfirm: ''
      }
    },
    methods: {
      async register () {
        try {
          await this.$axios.post('auth/local/register', {
              username: this.username,
              email: this.email,
              password: this.password
          })
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

  .gg-user,
  .gg-mail {
    --ggs: 0.8
  }

  .gg-lock {
    --ggs: 0.6
  }
</style>
