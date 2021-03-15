<template>
  <div class="w-screen h-screen flex">
    <div class="sidebar-left w-1/3">
      <overview :diagram="diagram" :style="{width:'200px', height:'300px'}"/>
      <node-list-view :nodes="nodes" :captions="shapes" class="w-full h-full"/>
    </div>
    <div class="main">
      <diagram-view
        id="diagram"
        :diagram="diagram"
        :style="{ position: 'absolute', height:'auto', width: 'auto', left: '0px', right: '0px', top: '0px',bottom: '0px'}"
      />
    </div>
  </div>
</template>

<script>
  import {onMounted} from 'vue'
  import * as mf from 'diagram-library'
  import {DiagramView, NodeListView, Overview} from 'diagram-library-vue'

  export default {
    name: 'mind-fusion',
    components: {DiagramView, NodeListView, Overview},
    setup () {
      const diagram = new mf.Diagramming.Diagram()
      console.log(diagram)
      const nodes = []
      const shapes = ['Actor', 'RoundRect', 'Triangle', 'Decision']
      for (let i = 0; i < shapes.length; ++i) {
        const node = new mf.Diagramming.ShapeNode(diagram)
        node.setText(shapes[i])
        node.setShape(shapes[i])
        nodes.push(node)
      }

      return {
        diagram,
        nodes,
        shapes
      }
    }
  }
</script>

<style scoped>

</style>
