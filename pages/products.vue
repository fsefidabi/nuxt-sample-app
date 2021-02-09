<template>
  <div class="min-h-screen flex flex-col">
    <Navbar/>
    <div>
      <div class="w-full flex justify-between flex-wrap px-24 py-20">
        <ProductComponent v-for="product in products"
                          :key="product.id"
                          :title="product.title"
                          :image="'http://localhost:1337'+product.image[0].url"
                          :price="product.price"/>
      </div>
    </div>
    <div>
      <div class="text-center my-10">
        <p>Mounted with <strong class="text-red-700">onMounted lifecycle hook</strong>
        </p>
        <p>Username: {{ onMountedUsername }}</p>
      </div>
      <div class="text-center my-10">
        <p>Mounted with <strong class="text-red-700">fetch hook</strong></p>
        <p>Username: {{ fetchUsername }}</p>
      </div>
      <div class="text-center my-10">
        <p>Mounted with <strong class="text-red-700">AsyncData</strong> method</p>
        <p>Username: --- </p>
        <p class="w-1/2 mx-auto">This hook is <b>before</b> creating components. So we have no access to <b>this</b>
          keyword and there is no <b>this.$auth</b> or <b>localstorage</b> to fetch this kind of data.</p>
      </div>
    </div>
    <footer class="flex justify-center mt-48 py-4 bg-gray-500">
      <NuxtLink to="/composition-api">Composition Api</NuxtLink>
    </footer>
  </div>
</template>

<script>
  import ProductComponent from '@/components/ProductComponent'
  import Navbar from '@/components/Navbar'

  export default {
    components: {Navbar, ProductComponent},
    middleware: 'guest',
    head () {
      return {
        title: 'Laptops',
        meta: [
          {
            hid: 'description',
            name: 'description',
            content:
              'List of some random products to test the SSR behavior of Nuxt.js'
          }
        ]
      }
    },
    data () {
      return {
        fetchedProducts: [],
        onMountedUsername: '',
        fetchUsername: ''
      }
    },
    async asyncData ({$axios}) {
      const products = await $axios.$get('/products')
      return {products}
    },
    async fetch () {
      this.fetchUsername = this.$auth.user.username
    },
    mounted() {
      this.onMountedUsername = this.$auth.user.username
    }
  }
</script>

<style>

</style>
