<template>
  <div onselectstart="javascript:/*IE8 hack*/return false" id="gfx_holder" class="w-screen h-screen"></div>
</template>

<script>
  import {onMounted} from '@nuxtjs/composition-api'
  import * as draw2d from 'draw2d'
  import 'jquery-ui/ui/widgets/draggable'
  import 'jquery-ui/ui/widgets/droppable'

  export default {
    name: 'draw2d',
    setup () {
      onMounted(() => {
        const canvas = new draw2d.Canvas('gfx_holder')
        canvas.installEditPolicy(new draw2d.policy.canvas.ShowGridEditPolicy(30))
        const figure =  new draw2d.shape.node.End({color: "#3d3d3d"})
        canvas.add(figure,50,10)
        console.log(canvas)
        console.log(figure)
      })
    }
  }
</script>

<style scoped>

</style>
