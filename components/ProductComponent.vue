<template>
  <NuxtLink to="#"
            class="w-full md:w-5/12 lg:w-64 mb-8 border rounded-md shadow-md hover:shadow-xl transition duration-500">
    <div class="w-full lg:h-56 px-2 overflow-hidden">
      <img :src="image" class="w">
    </div>
    <div class="px-8 py-4 bg-gray-200">
      <div class="mb-3 font-bold">{{ title }}</div>
      <div class="text-red-700">${{ price }}</div>
    </div>
  </NuxtLink>
</template>

<script>
  import ButtonComponent from '@/components/ButtonComponent'
  export default {
    name: 'ProductComponent',
    components: {ButtonComponent},
    props: ['image', 'title', 'price']
  }
</script>

<style scoped>

</style>
