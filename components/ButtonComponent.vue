<template>
  <button
    class="mt-5 py-3 px-6 bg-green-400 shadow-md rounded-md outline-none focus:outline-none font-bold text-gray-900 text-sm">
    {{ buttonText }}
  </button>
</template>

<script>
  export default {
    name: 'ButtonComponent',
    props: ['buttonText']
  }
</script>

<style scoped>

</style>
