<template>
  <div class="w-screen h-screen flex flex-col">
    <Navbar />
    <div class="w-full flex justify-between flex-wrap px-24 py-20">
      <ProductComponent v-for="product in products"
                        :key="product.id"
                        :title="product.title"
                        :image="'http://localhost:1337'+product.image[0].url"
                        :price="product.price" />
    </div>
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
    async asyncData ({$axios}) {
      const products = await $axios.$get('/products')
      return { products }
    }
  }
</script>

<style>

</style>
