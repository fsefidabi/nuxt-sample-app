<template>
  <NuxtChild></NuxtChild>
</template>

<script>
  export default {
    middleware ({redirect}) {
      return redirect('/products')
    }
  }
</script>

<style>

</style>
