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
    data () {
      return {
        products: []
      }
    },
    async mounted () {
      const res = await this.$axios.get('/products')
      this.products = res.data
      console.log(this.products)
    }
  }
</script>

<style>

</style>
